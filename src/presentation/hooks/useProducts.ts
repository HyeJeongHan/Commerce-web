'use client'

import { productRepository } from '@/infrastructure/repositories/product.repository.impl'
import { GetProductsUseCase } from '@/application/use-cases/product/get-products.use-case'
import { GetProductUseCase } from '@/application/use-cases/product/get-product.use-case'
import { ProductListParams } from '@/domain/repositories/product.repository'
import { useQuery } from '@tanstack/react-query'

const getProductsUseCase = new GetProductsUseCase(productRepository)
const getProductUseCase = new GetProductUseCase(productRepository)

export function useProducts(params?: ProductListParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProductsUseCase.execute(params),
  })
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductUseCase.execute(id),
    enabled: !!id,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productRepository.getCategories(),
  })
}
