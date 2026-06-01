import { Product } from './product.entity'

export interface CartItem {
  id: number
  product: Product
  quantity: number
}

export interface Cart {
  id: number
  items: CartItem[]
  totalPrice: number
}
