import { AuthTokens, IAuthRepository, LoginInput } from '@/domain/repositories/auth.repository'

export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(input: LoginInput): Promise<AuthTokens> {
    return this.authRepository.login(input)
  }
}
