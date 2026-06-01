import { Order } from '@/domain/entities/order.entity'
import { CreateOrderInput, IOrderRepository } from '@/domain/repositories/order.repository'
import { ApiResponse } from '@/shared/types/api.types'
import apiClient from '../api/client'

export class OrderRepositoryImpl implements IOrderRepository {
  async createOrder(input: CreateOrderInput): Promise<Order> {
    const { data } = await apiClient.post<ApiResponse<Order>>('/api/orders', input)
    return data.data
  }

  async getOrders(): Promise<Order[]> {
    const { data } = await apiClient.get<ApiResponse<Order[]>>('/api/orders')
    return data.data
  }

  async getOrder(orderId: number): Promise<Order> {
    const { data } = await apiClient.get<ApiResponse<Order>>(`/api/orders/${orderId}`)
    return data.data
  }

  async payOrder(orderId: number): Promise<Order> {
    const { data } = await apiClient.post<ApiResponse<Order>>(`/api/orders/${orderId}/pay`)
    return data.data
  }

  async cancelOrder(orderId: number): Promise<Order> {
    const { data } = await apiClient.post<ApiResponse<Order>>(`/api/orders/${orderId}/cancel`)
    return data.data
  }
}

export const orderRepository = new OrderRepositoryImpl()
