'use client'

import { orderRepository } from '@/infrastructure/repositories/order.repository.impl'
import { CreateOrderUseCase } from '@/application/use-cases/order/create-order.use-case'
import { GetOrdersUseCase } from '@/application/use-cases/order/get-orders.use-case'
import { PayOrderUseCase } from '@/application/use-cases/order/pay-order.use-case'
import { CreateOrderInput } from '@/domain/repositories/order.repository'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../store/auth.store'

const createOrderUseCase = new CreateOrderUseCase(orderRepository)
const getOrdersUseCase = new GetOrdersUseCase(orderRepository)
const payOrderUseCase = new PayOrderUseCase(orderRepository)

export function useOrders() {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: ['orders'],
    queryFn: () => getOrdersUseCase.execute(),
    enabled: isAuthenticated,
  })
}

export function useOrder(orderId: number) {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderRepository.getOrder(orderId),
    enabled: isAuthenticated && !!orderId,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateOrderInput) => createOrderUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export function usePayOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: number) => payOrderUseCase.execute(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: number) => orderRepository.cancelOrder(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
