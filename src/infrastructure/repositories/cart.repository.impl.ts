import { Cart } from '@/domain/entities/cart.entity'
import { AddToCartInput, ICartRepository } from '@/domain/repositories/cart.repository'
import { ApiResponse } from '@/shared/types/api.types'
import apiClient from '../api/client'

export class CartRepositoryImpl implements ICartRepository {
  async getCart(): Promise<Cart> {
    const { data } = await apiClient.get<ApiResponse<Cart>>('/api/cart')
    return data.data
  }

  async addItem(input: AddToCartInput): Promise<void> {
    await apiClient.post<ApiResponse<void>>('/api/cart/items', input)
  }

  async updateItemQuantity(cartItemId: number, quantity: number): Promise<Cart> {
    const { data } = await apiClient.patch<ApiResponse<Cart>>(
      `/api/cart/items/${cartItemId}`,
      { quantity }
    )
    return data.data
  }

  async removeItem(cartItemId: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`/api/cart/items/${cartItemId}`)
  }
}

export const cartRepository = new CartRepositoryImpl()
