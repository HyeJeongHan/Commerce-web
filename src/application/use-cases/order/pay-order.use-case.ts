import { Order } from '@/domain/entities/order.entity'
import { IOrderRepository } from '@/domain/repositories/order.repository'

export class PayOrderUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(orderId: number): Promise<Order> {
    return this.orderRepository.payOrder(orderId)
  }
}
