'use client'

import { useCallback, useMemo, useState } from 'react'
import { useInfiniteProducts, useCategories } from '@/presentation/hooks/useProducts'
import { useIntersectionObserver } from '@/presentation/hooks/useIntersectionObserver'
import ProductGrid from '@/presentation/components/features/product/ProductGrid'
import CategoryFilter from '@/presentation/components/features/product/CategoryFilter'
import SortSelect, { SortOption } from '@/presentation/components/features/product/SortSelect'
import Spinner from '@/presentation/components/ui/Spinner'
import { Product } from '@/domain/entities/product.entity'
import { Search } from 'lucide-react'

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const list = [...products]
  if (sort === 'price_asc') return list.sort((a, b) => a.price - b.price)
  if (sort === 'price_desc') return list.sort((a, b) => b.price - a.price)
  if (sort === 'name_asc') return list.sort((a, b) => a.name.localeCompare(b.name, 'ko'))
  return list
}

export default function ProductsPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [keyword, setKeyword] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [sort, setSort] = useState<SortOption>('default')

  const { data: categoriesData } = useCategories()

  // 백엔드가 categoryId 필터를 지원하지 않아 전체 목록을 받아 클라이언트에서 필터링
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteProducts({ size: 20 })

  const selectedCategoryName = useMemo(
    () => categoriesData?.find((c) => c.id === selectedCategoryId)?.name ?? null,
    [categoriesData, selectedCategoryId]
  )

  const displayedProducts = useMemo(() => {
    let list = data?.pages.flatMap((p) => p.content) ?? []

    // 카테고리 필터 (클라이언트 사이드)
    if (selectedCategoryName) {
      list = list.filter(
        (p) =>
          p.categoryName === selectedCategoryName ||
          p.category?.name === selectedCategoryName
      )
    }

    // 키워드 검색 (클라이언트 사이드)
    if (keyword.trim()) {
      const q = keyword.trim().toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      )
    }

    return sortProducts(list, sort)
  }, [data, selectedCategoryName, keyword, sort])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setKeyword(inputValue)
  }

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const sentinelRef = useIntersectionObserver(loadMore)

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-xs tracking-widest uppercase text-zinc-400 mb-1">Collection</p>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">All Products</h1>
      </div>

      {/* 검색 + 필터 + 정렬 */}
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <form onSubmit={handleSearch} className="relative w-full md:w-72">
            <input
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="상품 검색..."
              className="w-full border border-zinc-200 pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors">
              <Search size={16} />
            </button>
          </form>

          <div className="flex items-center gap-3 flex-wrap">
            {categoriesData && (
              <CategoryFilter
                categories={categoriesData}
                selectedId={selectedCategoryId}
                onSelect={setSelectedCategoryId}
              />
            )}
            <SortSelect value={sort} onChange={setSort} />
          </div>

          <p className="text-xs text-zinc-400 md:ml-auto whitespace-nowrap">
            {displayedProducts.length}개 상품
          </p>
        </div>
      </div>

      {/* 상품 그리드 */}
      {isLoading ? (
        <div className="flex justify-center py-24">
          <Spinner size={32} />
        </div>
      ) : (
        <>
          <ProductGrid products={displayedProducts} />

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="py-8 flex justify-center">
            {isFetchingNextPage && <Spinner size={24} />}
            {!hasNextPage && !isFetchingNextPage && displayedProducts.length > 0 && (
              <p className="text-xs text-zinc-300 tracking-widest uppercase">End of Collection</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
