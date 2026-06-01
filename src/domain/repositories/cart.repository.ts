import { Cart } from '../entities/cart.entity'

export interface AddToCartInput {
  productId: number
  quantity: number
}

export interface ICartRepository {
  getCart(): Promise<Cart>
  addItem(input: AddToCartInput): Promise<void>
  removeItem(cartItemId: number): Promise<void>
}
