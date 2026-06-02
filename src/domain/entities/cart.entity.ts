import { Product } from './product.entity'

// 백엔드 응답에 따라 product 전체 객체 또는 flat 필드로 올 수 있음
export interface CartItem {
  id: number
  quantity: number
  // 중첩 객체 형태
  product?: Product
  // flat 형태 (백엔드가 중첩 객체를 내려주지 않을 경우 대비)
  productId?: number
  productName?: string
  price?: number
}

export interface Cart {
  id: number
  items: CartItem[]
  totalPrice?: number
}

/** CartItem에서 상품명을 안전하게 추출 */
export function getCartItemName(item: CartItem): string {
  return item.product?.name ?? item.productName ?? ''
}

/** CartItem에서 가격을 안전하게 추출 */
export function getCartItemPrice(item: CartItem): number {
  return item.product?.price ?? item.price ?? 0
}

/** CartItem에서 카테고리명을 안전하게 추출 */
export function getCartItemCategory(item: CartItem): string {
  return item.product?.categoryName ?? item.product?.category?.name ?? ''
}

/** Cart 전체 합계 (totalPrice가 없으면 클라이언트 계산) */
export function getCartTotal(cart: Cart): number {
  if (cart.totalPrice != null) return cart.totalPrice
  return cart.items.reduce((sum, item) => sum + getCartItemPrice(item) * item.quantity, 0)
}
