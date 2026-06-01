import { Category, Product, ProductPage } from '@/domain/entities/product.entity'
import { IProductRepository, ProductListParams } from '@/domain/repositories/product.repository'
import { ApiResponse, PageResponse } from '@/shared/types/api.types'
import apiClient from '../api/client'

export class ProductRepositoryImpl implements IProductRepository {
  async getProducts(params?: ProductListParams): Promise<ProductPage> {
    const { data } = await apiClient.get<ApiResponse<PageResponse<Product>>>('/api/products', {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 12,
        categoryId: params?.categoryId,
        keyword: params?.keyword,
      },
    })
    return data.data
  }

  async getProduct(id: number): Promise<Product> {
    const { data } = await apiClient.get<ApiResponse<Product>>(`/api/products/${id}`)
    return data.data
  }

  async getCategories(): Promise<Category[]> {
    const { data } = await apiClient.get<ApiResponse<Category[]>>('/api/categories')
    return data.data
  }
}

export const productRepository = new ProductRepositoryImpl()
