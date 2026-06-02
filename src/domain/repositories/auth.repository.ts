import { Member } from '../entities/member.entity'

export interface SignupInput {
  email: string
  password: string
  name: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
}

export interface IAuthRepository {
  signup(input: SignupInput): Promise<void>
  login(input: LoginInput): Promise<AuthTokens>
  getMe(): Promise<Member>
  changePassword(input: ChangePasswordInput): Promise<void>
}
