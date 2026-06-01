import { Member } from '@/domain/entities/member.entity'
import { IAuthRepository } from '@/domain/repositories/auth.repository'

export class GetMeUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(): Promise<Member> {
    return this.authRepository.getMe()
  }
}
