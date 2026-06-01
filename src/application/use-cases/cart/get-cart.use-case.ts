import { Cart } from '@/domain/entities/cart.entity'
import { ICartRepository } from '@/domain/repositories/cart.repository'

export class GetCartUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(): Promise<Cart> {
    return this.cartRepository.getCart()
  }
}
