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

const getCartUseCase = new GetCartUseCase(cartRepository)
const addToCartUseCase = new AddToCartUseCase(cartRepository)
const removeFromCartUseCase = new RemoveFromCartUseCase(cartRepository)
const updateCartQuantityUseCase = new UpdateCartQuantityUseCase(cartRepository)

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

  const updateQuantityMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) =>
      updateCartQuantityUseCase.execute(cartItemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const increaseQuantity = (item: CartItem) =>
    updateQuantityMutation.mutateAsync({ cartItemId: item.id, quantity: item.quantity + 1 })

  const decreaseQuantity = (item: CartItem) => {
    if (item.quantity <= 1) return removeMutation.mutateAsync(item.id)
    return updateQuantityMutation.mutateAsync({ cartItemId: item.id, quantity: item.quantity - 1 })
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
    isRemoving: removeMutation.isPending || updateQuantityMutation.isPending,
  }
}
