'use client'

import { use, useEffect } from 'react'
import { useProduct } from '@/presentation/hooks/useProducts'
import { useCart } from '@/presentation/hooks/useCart'
import { useUIStore } from '@/presentation/store/ui.store'
import { useAuthStore } from '@/presentation/store/auth.store'
import { useWishlist } from '@/presentation/hooks/useWishlist'
import { useRecentlyViewed } from '@/presentation/hooks/useRecentlyViewed'
import { formatPrice } from '@/shared/utils/format'
import { getProductImageUrl } from '@/shared/utils/productImage'
import { ROUTES } from '@/shared/constants/routes'
import Spinner from '@/presentation/components/ui/Spinner'
import RecentlyViewed from '@/presentation/components/features/product/RecentlyViewed'
import { ArrowLeft, Heart } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default function ProductDetailPage({ params }: Props) {
  const { id } = use(params)
  const productId = parseInt(id)
  const { data: product, isLoading } = useProduct(productId)
  const { addToCart, isAdding } = useCart()
  const { openCart } = useUIStore()
  const { isAuthenticated } = useAuthStore()
  const { toggle, isWishlisted } = useWishlist()
  const { track } = useRecentlyViewed()
  const router = useRouter()

  // 상품 로드 시 최근 본 상품 추적
  useEffect(() => {
    if (product) track(product)
  }, [product, track])

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN)
      return
    }
    await addToCart({ productId, quantity: 1 })
    openCart()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size={32} />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-24 text-center">
        <p className="text-zinc-400">상품을 찾을 수 없습니다.</p>
        <Link href={ROUTES.PRODUCTS} className="mt-4 inline-block text-xs font-semibold uppercase tracking-widest underline underline-offset-4">
          Back to Products
        </Link>
      </div>
    )
  }

  const isAvailable = product.status === 'ACTIVE' && product.stockQuantity > 0
  const wishlisted = isWishlisted(product.id)

  return (
    <div>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href={ROUTES.PRODUCTS} className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-black transition-colors mb-8">
          <ArrowLeft size={14} />
          Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image */}
          <div className="aspect-[3/4] bg-zinc-100 overflow-hidden">
            <img
              src={getProductImageUrl(product)}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col py-4">
            <p className="text-xs tracking-widest uppercase text-zinc-400 mb-2">{product.categoryName ?? product.category?.name ?? ''}</p>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight mb-4">
              {product.name}
            </h1>
            <p className="text-2xl font-bold mb-6">{formatPrice(product.price)}</p>

            {product.description && (
              <p className="text-sm text-zinc-500 leading-relaxed mb-8">{product.description}</p>
            )}

            <div className="mb-8">
              {product.stockQuantity > 0 ? (
                <p className="text-xs text-zinc-400">
                  재고: <span className="text-black font-medium">{product.stockQuantity}개</span>
                </p>
              ) : (
                <p className="text-xs text-red-500 font-medium">품절</p>
              )}
            </div>

            <div className="flex gap-3 mb-4">
              <button
                onClick={handleAddToCart}
                disabled={!isAvailable || isAdding}
                className="flex-1 bg-black text-white text-xs font-semibold tracking-widest uppercase py-4 hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isAdding ? 'Adding...' : !isAvailable ? 'Out of Stock' : 'Add to Cart'}
              </button>

              {/* 위시리스트 버튼 */}
              <button
                onClick={() => toggle(product)}
                className={`w-14 border flex items-center justify-center transition-colors ${
                  wishlisted
                    ? 'border-red-400 text-red-500 bg-red-50'
                    : 'border-zinc-200 text-zinc-400 hover:border-black hover:text-black'
                }`}
              >
                <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="border-t border-zinc-100 pt-6 mt-auto space-y-3">
              {[
                ['배송', '3-5 영업일 내 배송'],
                ['반품', '수령 후 7일 이내 반품 가능'],
                ['문의', 'commerce@example.com'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-xs text-zinc-500">
                  <span className="font-medium text-black">{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 최근 본 상품 */}
      <RecentlyViewed />
    </div>
  )
}
