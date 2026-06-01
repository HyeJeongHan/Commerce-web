import { ProductPage } from '@/domain/entities/product.entity'
import { IProductRepository, ProductListParams } from '@/domain/repositories/product.repository'

export class GetProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(params?: ProductListParams): Promise<ProductPage> {
    return this.productRepository.getProducts(params)
  }
}
