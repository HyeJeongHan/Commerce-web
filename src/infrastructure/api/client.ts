import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import { AUTH_STORE_KEY, SESSION_COOKIE } from '@/shared/constants/auth'

// 토큰 자체는 httpOnly 쿠키(서버 전용) — JS에서 직접 접근 불가
// 로그인 여부만 비민감 세션 마커로 확인
export function hasSession(): boolean {
  return !!Cookies.get(SESSION_COOKIE)
}

export function clearSession(): void {
  Cookies.remove(SESSION_COOKIE)
  localStorage.removeItem(AUTH_STORE_KEY)
}

const apiClient: AxiosInstance = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
})

// Authorization 헤더는 middleware(src/middleware.ts)가 httpOnly 쿠키에서 읽어 자동 주입
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => config)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
