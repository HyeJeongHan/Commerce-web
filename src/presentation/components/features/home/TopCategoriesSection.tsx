'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ROUTES } from '@/shared/constants/routes'
import { useInfiniteProducts } from '@/presentation/hooks/useProducts'
import { useMemo } from 'react'
import Spinner from '@/presentation/components/ui/Spinner'

// 카테고리명 → 대표 이미지 매핑
const CATEGORY_IMAGES: Record<string, string> = {
  '전자기기':   'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
  '패션/의류':  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  '식품/음료':  'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80',
  '생활용품':   'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
  '스포츠/레저':'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
}
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80'

export default function TopCategoriesSection() {
  // 카테고리 집계용: staleTime 길게 설정해 홈 재방문마다 재조회 방지
  const { data, isLoading } = useInfiniteProducts({ size: 100 })

  // 카테고리별 상품 수 집계 → 상위 3개 추출
  const top3 = useMemo(() => {
    const counts: Record<string, number> = {}
    data?.pages.flatMap((p) => p.content).forEach((product) => {
      const cat = product.categoryName ?? product.category?.name ?? '기타'
      counts[cat] = (counts[cat] ?? 0) + 1
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }))
  }, [data])

  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs tracking-widest uppercase text-zinc-400 mb-1">Explore</p>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Categories</h2>
        </div>
        <Link
          href={ROUTES.PRODUCTS}
          className="text-xs font-semibold tracking-widest uppercase underline underline-offset-4 hover:no-underline transition-all hidden md:block"
        >
          View All
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size={28} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {top3.map(({ name, count }) => (
            <Link
              key={name}
              href={ROUTES.PRODUCTS}
              className="group relative aspect-[4/5] overflow-hidden bg-zinc-100"
            >
              <img
                src={CATEGORY_IMAGES[name] ?? FALLBACK_IMAGE}
                alt={name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-xl font-black tracking-[-0.02em] uppercase">
                  {name}
                </h3>
                <p className="text-zinc-300 text-xs mt-1">{count}개 상품</p>
                <p className="text-zinc-300 text-xs tracking-widest uppercase mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Shop Now <ArrowRight size={12} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
