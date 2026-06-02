'use client'

import { useAuthStore } from '@/presentation/store/auth.store'
import { hasSession } from '@/infrastructure/api/client'

/**
 * 인증 준비 상태를 단일 훅으로 집중 관리.
 * Zustand 하이드레이션 완료 + 세션 쿠키 존재 여부를 함께 확인.
 */
export function useIsAuthReady(): boolean {
  const { isAuthenticated, _hasHydrated } = useAuthStore()
  return _hasHydrated && isAuthenticated && hasSession()
}
