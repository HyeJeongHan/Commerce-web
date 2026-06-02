import { Member } from '@/domain/entities/member.entity'
import { AuthTokens, ChangePasswordInput, IAuthRepository, LoginInput, SignupInput } from '@/domain/repositories/auth.repository'
import { ApiResponse } from '@/shared/types/api.types'
import apiClient from '../api/client'

export class AuthRepositoryImpl implements IAuthRepository {
  async signup(input: SignupInput): Promise<void> {
    await apiClient.post<ApiResponse<void>>('/api/auth/signup', input)
  }

  async login(input: LoginInput): Promise<AuthTokens> {
    // Next.js Route Handler(/api/auth/login)가 httpOnly 쿠키 설정을 담당
    const { data } = await apiClient.post<ApiResponse<AuthTokens>>('/api/auth/login', input)
    return data.data
  }

  async getMe(): Promise<Member> {
    const { data } = await apiClient.get<ApiResponse<Member>>('/api/members/me')
    return data.data
  }

  async changePassword(input: ChangePasswordInput): Promise<void> {
    await apiClient.put<ApiResponse<void>>('/api/members/password', input)
  }
}

export const authRepository = new AuthRepositoryImpl()
