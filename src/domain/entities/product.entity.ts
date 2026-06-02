export type ProductStatus = 'ACTIVE' | 'INACTIVE'

export interface Category {
  id: number
  name: string
  description?: string
}

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  status: ProductStatus
  category?: Category
  categoryName?: string
  stockQuantity: number
  imageUrl?: string
}

export interface ProductPage {
  content: Product[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  last: boolean
  first: boolean
}
