'use client'

import { cartRepository } from '@/infrastructure/repositories/cart.repository.impl'
import { GetCartUseCase } from '@/application/use-cases/cart/get-cart.use-case'
import { AddToCartUseCase } from '@/application/use-cases/cart/add-to-cart.use-case'
import { RemoveFromCartUseCase } from '@/application/use-cases/cart/remove-from-cart.use-case'
import { AddToCartInput } from '@/domain/repositories/cart.repository'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useIsAuthReady } from './useIsAuthReady'

const getCartUseCase = new GetCartUseCase(cartRepository)
const addToCartUseCase = new AddToCartUseCase(cartRepository)
const removeFromCartUseCase = new RemoveFromCartUseCase(cartRepository)

export function useCart() {
  const queryClient = useQueryClient()
  const isAuthReady = useIsAuthReady()

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

  const totalItems = cartQuery.data?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return {
    cart: cartQuery.data,
    totalItems,
    isLoading: cartQuery.isLoading,
    addToCart: addMutation.mutateAsync,
    removeFromCart: removeMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  }
}
