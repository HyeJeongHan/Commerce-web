import { ICartRepository } from '@/domain/repositories/cart.repository'

export class RemoveFromCartUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(cartItemId: number): Promise<void> {
    return this.cartRepository.removeItem(cartItemId)
  }
}
