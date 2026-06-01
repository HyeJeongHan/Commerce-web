import { IAuthRepository, SignupInput } from '@/domain/repositories/auth.repository'

export class SignupUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(input: SignupInput): Promise<void> {
    return this.authRepository.signup(input)
  }
}
