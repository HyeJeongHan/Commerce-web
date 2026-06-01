'use client'

import { LoginInput, SignupInput } from '@/domain/repositories/auth.repository'
import { authRepository } from '@/infrastructure/repositories/auth.repository.impl'
import { LoginUseCase } from '@/application/use-cases/auth/login.use-case'
import { SignupUseCase } from '@/application/use-cases/auth/signup.use-case'
import { GetMeUseCase } from '@/application/use-cases/auth/get-me.use-case'
import { useAuthStore } from '../store/auth.store'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { getAccessToken } from '@/infrastructure/api/client'

const loginUseCase = new LoginUseCase(authRepository)
const signupUseCase = new SignupUseCase(authRepository)
const getMeUseCase = new GetMeUseCase(authRepository)

export function useAuth() {
  const { member, isAuthenticated, setMember, logout } = useAuthStore()
  const router = useRouter()

  useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const me = await getMeUseCase.execute()
      setMember(me)
      return me
    },
    enabled: !!getAccessToken() && !member,
    retry: false,
  })

  const loginMutation = useMutation({
    mutationFn: (input: LoginInput) => loginUseCase.execute(input),
    onSuccess: async () => {
      const me = await getMeUseCase.execute()
      setMember(me)
      router.push('/')
    },
  })

  const signupMutation = useMutation({
    mutationFn: (input: SignupInput) => signupUseCase.execute(input),
    onSuccess: () => router.push('/login'),
  })

  const handleLogout = () => {
    logout()
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
