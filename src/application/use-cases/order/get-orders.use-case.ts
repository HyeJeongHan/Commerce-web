import { Order } from '@/domain/entities/order.entity'
import { IOrderRepository } from '@/domain/repositories/order.repository'

export class GetOrdersUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(): Promise<Order[]> {
    return this.orderRepository.getOrders()
  }
}
