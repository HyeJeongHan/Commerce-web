import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
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

// 토큰 갱신 중복 방지
let isRefreshing = false
let failedQueue: Array<{ resolve: () => void; reject: (e: unknown) => void }> = []

function processQueue(error: unknown) {
  failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()))
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !original._retry) {
      // 리프레시 토큰이 없으면 바로 로그아웃
      if (!hasRefresh()) {
        clearSession()
        if (typeof window !== 'undefined') window.location.href = '/login'
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // 갱신 중인 다른 요청이 있으면 큐에 대기
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(apiClient(original)),
            reject,
          })
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const res = await fetch('/api/auth/refresh', { method: 'POST' })
        if (!res.ok) throw new Error('refresh_failed')
        processQueue(null)
        return apiClient(original)
      } catch (refreshError) {
        processQueue(refreshError)
        clearSession()
        if (typeof window !== 'undefined') window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
