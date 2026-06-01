import { Member } from '@/domain/entities/member.entity'
import { AuthTokens, IAuthRepository, LoginInput, SignupInput } from '@/domain/repositories/auth.repository'
import { ApiResponse } from '@/shared/types/api.types'
import apiClient, { setAccessToken } from '../api/client'

export class AuthRepositoryImpl implements IAuthRepository {
  async signup(input: SignupInput): Promise<void> {
    await apiClient.post<ApiResponse<void>>('/api/auth/signup', input)
  }

  async login(input: LoginInput): Promise<AuthTokens> {
    const { data } = await apiClient.post<ApiResponse<AuthTokens>>('/api/auth/login', input)
    setAccessToken(data.data.accessToken)
    return data.data
  }

  async getMe(): Promise<Member> {
    const { data } = await apiClient.get<ApiResponse<Member>>('/api/members/me')
    return data.data
  }
}

export const authRepository = new AuthRepositoryImpl()
