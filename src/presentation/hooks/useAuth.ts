'use client'

import { LoginInput, SignupInput } from '@/domain/repositories/auth.repository'
import { authRepository } from '@/infrastructure/repositories/auth.repository.impl'
import { LoginUseCase } from '@/application/use-cases/auth/login.use-case'
import { SignupUseCase } from '@/application/use-cases/auth/signup.use-case'
import { GetMeUseCase } from '@/application/use-cases/auth/get-me.use-case'
import { useAuthStore } from '../store/auth.store'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { hasSession, clearSession } from '@/infrastructure/api/client'

const loginUseCase = new LoginUseCase(authRepository)
const signupUseCase = new SignupUseCase(authRepository)
const getMeUseCase = new GetMeUseCase(authRepository)

export function useAuth() {
  const { member, isAuthenticated, setMember, logout } = useAuthStore()
  const router = useRouter()
  const queryClient = useQueryClient()

  // 세션 마커 쿠키가 있고 아직 member 정보가 없을 때만 /me 호출
  useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const me = await getMeUseCase.execute()
      setMember(me)
      return me
    },
    enabled: hasSession() && !member,
    retry: false,
  })

  const loginMutation = useMutation({
    mutationFn: (input: LoginInput) => loginUseCase.execute(input),
    onSuccess: () => {
      // /me 캐시 무효화 → 위 useQuery가 자동으로 재호출
      queryClient.invalidateQueries({ queryKey: ['me'] })
      router.push('/')
    },
  })

  const signupMutation = useMutation({
    mutationFn: (input: SignupInput) => signupUseCase.execute(input),
    onSuccess: () => router.push('/login'),
  })

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    clearSession()
    logout()
    queryClient.clear()
    router.push('/')
  }

  return {
    member,
    isAuthenticated,
    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    logout: handleLogout,
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
    loginError: loginMutation.error,
    signupError: signupMutation.error,
  }
}
