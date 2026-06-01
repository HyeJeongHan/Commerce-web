export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface OrderItem {
  id: number
  productName: string
  price: number
  quantity: number
  subtotal: number
}

export interface Order {
  id: number
  totalPrice: number
  orderStatus: OrderStatus
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}
