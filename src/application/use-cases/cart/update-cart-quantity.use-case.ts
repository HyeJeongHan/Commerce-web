import { Cart } from '@/domain/entities/cart.entity'
import { ICartRepository } from '@/domain/repositories/cart.repository'

export class UpdateCartQuantityUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(cartItemId: number, quantity: number): Promise<Cart> {
    return this.cartRepository.updateItemQuantity(cartItemId, quantity)
  }
}
