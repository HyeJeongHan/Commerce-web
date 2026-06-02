'use client'

import { orderRepository } from '@/infrastructure/repositories/order.repository.impl'
import { CreateOrderUseCase } from '@/application/use-cases/order/create-order.use-case'
import { GetOrdersUseCase } from '@/application/use-cases/order/get-orders.use-case'
import { PayOrderUseCase } from '@/application/use-cases/order/pay-order.use-case'
import { OrderStatus } from '@/domain/entities/order.entity'
import { CreateOrderInput } from '@/domain/repositories/order.repository'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useIsAuthReady } from './useIsAuthReady'

const createOrderUseCase = new CreateOrderUseCase(orderRepository)
const getOrdersUseCase = new GetOrdersUseCase(orderRepository)
const payOrderUseCase = new PayOrderUseCase(orderRepository)

export function useOrders() {
  const isAuthReady = useIsAuthReady()

  return useQuery({
    queryKey: ['orders'],
    queryFn: () => getOrdersUseCase.execute(),
    enabled: isAuthReady,
  })
}

export function useOrder(orderId: number) {
  const isAuthReady = useIsAuthReady()

  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderRepository.getOrder(orderId),
    enabled: isAuthReady && !!orderId,
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

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: OrderStatus }) =>
      orderRepository.updateOrderStatus(orderId, status),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
