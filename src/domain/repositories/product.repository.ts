import { Category, Product, ProductPage } from '../entities/product.entity'

export interface ProductListParams {
  page?: number
  size?: number
  categoryId?: number
  keyword?: string
}

export interface IProductRepository {
  getProducts(params?: ProductListParams): Promise<ProductPage>
  getProduct(id: number): Promise<Product>
  getCategories(): Promise<Category[]>
}
