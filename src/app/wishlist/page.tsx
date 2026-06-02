'use client'

import { useWishlist } from '@/presentation/hooks/useWishlist'
import ProductGrid from '@/presentation/components/features/product/ProductGrid'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/shared/constants/routes'

export default function WishlistPage() {
  const { items, toggle } = useWishlist()

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs tracking-widest uppercase text-zinc-400 mb-1">My Account</p>
          <h1 className="text-4xl font-black uppercase tracking-tight">Wishlist</h1>
        </div>
        {items.length > 0 && (
          <p className="text-sm text-zinc-400">{items.length}개 상품</p>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Heart size={48} className="text-zinc-200" />
          <p className="text-zinc-400 text-sm">찜한 상품이 없습니다.</p>
          <Link
            href={ROUTES.PRODUCTS}
            className="text-xs font-semibold tracking-widest uppercase border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <ProductGrid products={items} />
      )}
    </div>
  )
}
