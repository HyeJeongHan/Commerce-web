import { Cart } from '../entities/cart.entity'

export interface AddToCartInput {
  productId: number
  quantity: number
}

export interface ICartRepository {
  getCart(): Promise<Cart>
  addItem(input: AddToCartInput): Promise<void>
  updateItemQuantity(cartItemId: number, quantity: number): Promise<Cart>
  removeItem(cartItemId: number): Promise<void>
}
