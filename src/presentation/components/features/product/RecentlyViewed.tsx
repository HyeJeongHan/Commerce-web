'use client'

import { useRecentlyViewed } from '@/presentation/hooks/useRecentlyViewed'
import { formatPrice } from '@/shared/utils/format'
import { ROUTES } from '@/shared/constants/routes'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function RecentlyViewed() {
  const { items, clear } = useRecentlyViewed()

  if (items.length === 0) return null

  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-zinc-100">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs tracking-widest uppercase text-zinc-400 mb-1">History</p>
          <h2 className="text-2xl font-black uppercase tracking-tight">최근 본 상품</h2>
        </div>
        <button
          onClick={clear}
          className="text-xs text-zinc-400 hover:text-black transition-colors underline underline-offset-2"
        >
          전체 삭제
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {items.map((product) => (
          <Link
            key={product.id}
            href={ROUTES.PRODUCT(product.id)}
            className="flex-shrink-0 w-36 group"
          >
            <div className="aspect-[3/4] bg-zinc-100 overflow-hidden mb-2">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag size={20} className="text-zinc-300" />
                </div>
              )}
            </div>
            <p className="text-xs font-medium leading-snug line-clamp-2 group-hover:underline underline-offset-2">
              {product.name}
            </p>
            <p className="text-xs font-semibold mt-0.5 text-zinc-600">{formatPrice(product.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
