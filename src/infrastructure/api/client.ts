import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

// Axios 내부 config 타입 확장 — 재시도 플래그
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean
  }
}
import Cookies from 'js-cookie'
import { AUTH_STORE_KEY, SESSION_COOKIE, HAS_REFRESH_COOKIE } from '@/shared/constants/auth'

export function hasSession(): boolean {
  return !!Cookies.get(SESSION_COOKIE)
}

export function hasRefresh(): boolean {
  return !!Cookies.get(HAS_REFRESH_COOKIE)
}

export function clearSession(): void {
  Cookies.remove(SESSION_COOKIE)
  Cookies.remove(HAS_REFRESH_COOKIE)
  localStorage.removeItem(AUTH_STORE_KEY)
}

const apiClient: AxiosInstance = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
})

// Authorization 헤더는 middleware(src/middleware.ts)가 httpOnly 쿠키에서 읽어 자동 주입
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => config)

// 토큰 갱신 중 동시 요청 큐잉
let isRefreshing = false
let failedQueue: Array<{ resolve: () => void; reject: (e: unknown) => void }> = []

function processQueue(error: unknown) {
  failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()))
  failedQueue = []
}

// 비즈니스 로직으로 인한 401은 refresh를 건너뜀 (인증과 무관한 에러)
const SKIP_REFRESH_PATHS = [
  '/api/auth/',   // 인증 엔드포인트 자체
]

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as InternalAxiosRequestConfig
    const url = original.url ?? ''

    // 401이 아니거나, 이미 재시도했거나, refresh 제외 경로면 바로 reject
    if (
      error.response?.status !== 401 ||
      original._retry ||
      SKIP_REFRESH_PATHS.some((p) => url.includes(p))
    ) {
      return Promise.reject(error)
    }

    // refresh 토큰 없으면 바로 로그아웃
    if (!hasRefresh()) {
      clearSession()
      if (typeof window !== 'undefined') window.location.href = '/login'
      return Promise.reject(error)
    }

    // 이미 갱신 중이면 큐에 대기 — 갱신 완료 후 재시도
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(apiClient({ ...original, _retry: true } as InternalAxiosRequestConfig)),
          reject,
        })
      })
    }

    original._retry = true
    isRefreshing = true

    try {
      // refresh 자체는 apiClient 인터셉터를 우회해야 무한 루프 방지 → bare fetch 사용
      const res = await fetch('/api/auth/refresh', { method: 'POST' })
      if (!res.ok) throw new Error('refresh_failed')

      processQueue(null)
      // 새 토큰이 httpOnly 쿠키에 세팅됐으므로 원래 요청 재시도
      return apiClient({ ...original, _retry: true } as InternalAxiosRequestConfig)
    } catch (refreshError) {
      processQueue(refreshError)
      clearSession()
      if (typeof window !== 'undefined') window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default apiClient
