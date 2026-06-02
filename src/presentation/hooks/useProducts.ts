'use client'

import { productRepository } from '@/infrastructure/repositories/product.repository.impl'
import { GetProductUseCase } from '@/application/use-cases/product/get-product.use-case'
import { ProductListParams } from '@/domain/repositories/product.repository'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

const getProductUseCase = new GetProductUseCase(productRepository)

export function useInfiniteProducts(params?: Omit<ProductListParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: ['products', params],
    queryFn: ({ pageParam = 0 }) =>
      productRepository.getProducts({ ...params, page: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.number + 1,
    staleTime: 60 * 1000, // 60초 캐시로 필터 전환 시 불필요한 재조회 감소
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
    staleTime: 10 * 60 * 1000, // 카테고리는 거의 안 바뀌므로 10분 캐시
  })
}
