import { Order } from '@/domain/entities/order.entity'
import { CreateOrderInput, IOrderRepository } from '@/domain/repositories/order.repository'

export class CreateOrderUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(input: CreateOrderInput): Promise<Order> {
    return this.orderRepository.createOrder(input)
  }
}
