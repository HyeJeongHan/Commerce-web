import { Product } from '@/domain/entities/product.entity'
import { IProductRepository } from '@/domain/repositories/product.repository'

export class GetProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: number): Promise<Product> {
    return this.productRepository.getProduct(id)
  }
}
