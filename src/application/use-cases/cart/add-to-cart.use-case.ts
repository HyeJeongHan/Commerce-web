import { AddToCartInput, ICartRepository } from '@/domain/repositories/cart.repository'

export class AddToCartUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(input: AddToCartInput): Promise<void> {
    return this.cartRepository.addItem(input)
  }
}
