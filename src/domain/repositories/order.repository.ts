import { Order } from '../entities/order.entity'

export interface CreateOrderInput {
  cartItemIds: number[]
}

export interface IOrderRepository {
  createOrder(input: CreateOrderInput): Promise<Order>
  getOrders(): Promise<Order[]>
  getOrder(orderId: number): Promise<Order>
  payOrder(orderId: number): Promise<Order>
  cancelOrder(orderId: number): Promise<Order>
}
