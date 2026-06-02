'use client'

import { Product } from '@/domain/entities/product.entity'
import { formatPrice } from '@/shared/utils/format'
import { ROUTES } from '@/shared/constants/routes'
import { useCart } from '@/presentation/hooks/useCart'
import { useUIStore } from '@/presentation/store/ui.store'
import { useAuthStore } from '@/presentation/store/auth.store'
import { useWishlist } from '@/presentation/hooks/useWishlist'
import { ShoppingBag, Heart } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { addToCart, isAdding } = useCart()
  const { openCart } = useUIStore()
  const { isAuthenticated } = useAuthStore()
  const { toggle, isWishlisted } = useWishlist()
  const router = useRouter()
  const [hovered, setHovered] = useState(false)

  const wishlisted = isWishlisted(product.id)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN)
      return
    }
    await addToCart({ productId: product.id, quantity: 1 })
    openCart()
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    toggle(product)
  }

  return (
    <Link
      href={ROUTES.PRODUCT(product.id)}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden mb-4">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${hovered ? 'scale-105' : 'scale-100'}`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
            <ShoppingBag size={32} className="text-zinc-300" />
          </div>
        )}

        {product.status === 'INACTIVE' && (
          <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-semibold tracking-widest uppercase px-2 py-1">
            Sold Out
          </div>
        )}

        {/* 위시리스트 하트 버튼 */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-1.5 rounded-full transition-all duration-200 ${
            wishlisted
              ? 'text-red-500 opacity-100'
              : 'text-white opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Add to cart 오버레이 */}
        <div className={`absolute bottom-0 left-0 right-0 transition-transform duration-300 ${hovered ? 'translate-y-0' : 'translate-y-full'}`}>
          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.status === 'INACTIVE' || product.stockQuantity === 0}
            className="w-full bg-black text-white text-xs font-semibold tracking-widest uppercase py-3.5 hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-[10px] tracking-widest uppercase text-zinc-400">{product.categoryName ?? product.category?.name ?? ''}</p>
        <p className="text-sm font-medium leading-snug group-hover:underline underline-offset-2 transition-all">
          {product.name}
        </p>
        <p className="text-sm font-semibold">{formatPrice(product.price)}</p>
      </div>
    </Link>
  )
}
