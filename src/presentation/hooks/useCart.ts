'use client'

import { cartRepository } from '@/infrastructure/repositories/cart.repository.impl'
import { GetCartUseCase } from '@/application/use-cases/cart/get-cart.use-case'
import { AddToCartUseCase } from '@/application/use-cases/cart/add-to-cart.use-case'
import { RemoveFromCartUseCase } from '@/application/use-cases/cart/remove-from-cart.use-case'
import { UpdateCartQuantityUseCase } from '@/application/use-cases/cart/update-cart-quantity.use-case'
import { AddToCartInput } from '@/domain/repositories/cart.repository'
import { CartItem } from '@/domain/entities/cart.entity'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useIsAuthReady } from './useIsAuthReady'
import { useRef } from 'react'

const getCartUseCase = new GetCartUseCase(cartRepository)
const addToCartUseCase = new AddToCartUseCase(cartRepository)
const removeFromCartUseCase = new RemoveFromCartUseCase(cartRepository)
const updateCartQuantityUseCase = new UpdateCartQuantityUseCase(cartRepository)

export function useCart() {
  const queryClient = useQueryClient()
  const isAuthReady = useIsAuthReady()
  // 연속 클릭 시 가장 최근 수량만 적용하기 위한 ref 디바운스
  const pendingQuantityRef = useRef<Record<number, number>>({})

  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: () => getCartUseCase.execute(),
    enabled: isAuthReady,
  })

  const addMutation = useMutation({
    mutationFn: (input: AddToCartInput) => addToCartUseCase.execute(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const removeMutation = useMutation({
    mutationFn: (cartItemId: number) => removeFromCartUseCase.execute(cartItemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const updateQuantityMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) =>
      updateCartQuantityUseCase.execute(cartItemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  // 연타 방지: 100ms 내 마지막 요청만 실제 전송
  const updateQuantityDebounced = (item: CartItem, quantity: number) => {
    pendingQuantityRef.current[item.id] = quantity
    setTimeout(() => {
      const target = pendingQuantityRef.current[item.id]
      if (target === undefined) return
      delete pendingQuantityRef.current[item.id]
      if (target <= 0) {
        removeMutation.mutate(item.id)
      } else {
        updateQuantityMutation.mutate({ cartItemId: item.id, quantity: target })
      }
    }, 100)
  }

  const increaseQuantity = (item: CartItem) => {
    const pending = pendingQuantityRef.current[item.id]
    const base = pending ?? item.quantity
    updateQuantityDebounced(item, base + 1)
  }

  const decreaseQuantity = (item: CartItem) => {
    const pending = pendingQuantityRef.current[item.id]
    const base = pending ?? item.quantity
    updateQuantityDebounced(item, base - 1)
  }

  const totalItems = cartQuery.data?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return {
    cart: cartQuery.data,
    totalItems,
    isLoading: cartQuery.isLoading,
    addToCart: addMutation.mutateAsync,
    removeFromCart: removeMutation.mutateAsync,
    increaseQuantity,
    decreaseQuantity,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    isUpdatingQuantity: updateQuantityMutation.isPending,
  }
}
