'use client'

import { useState } from 'react'
import { useProducts, useCategories } from '@/presentation/hooks/useProducts'
import ProductGrid from '@/presentation/components/features/product/ProductGrid'
import CategoryFilter from '@/presentation/components/features/product/CategoryFilter'
import Pagination from '@/presentation/components/ui/Pagination'
import Spinner from '@/presentation/components/ui/Spinner'
import { Search } from 'lucide-react'

export default function ProductsPage() {
  const [page, setPage] = useState(0)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [keyword, setKeyword] = useState('')
  const [inputValue, setInputValue] = useState('')

  const { data: categoriesData } = useCategories()
  const { data, isLoading } = useProducts({
    page,
    size: 12,
    categoryId: selectedCategoryId ?? undefined,
    keyword: keyword || undefined,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setKeyword(inputValue)
    setPage(0)
  }

  const handleCategorySelect = (id: number | null) => {
    setSelectedCategoryId(id)
    setPage(0)
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <div className="mb-10">
        <p className="text-xs tracking-widest uppercase text-zinc-400 mb-1">Collection</p>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">All Products</h1>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
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

        {categoriesData && (
          <CategoryFilter
            categories={categoriesData}
            selectedId={selectedCategoryId}
            onSelect={handleCategorySelect}
          />
        )}

        {data && (
          <p className="text-xs text-zinc-400 md:ml-auto whitespace-nowrap">
            {data.totalElements}개 상품
          </p>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-24">
          <Spinner size={32} />
        </div>
      ) : data ? (
        <>
          <ProductGrid products={data.content} />
          <Pagination
            currentPage={data.number}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </>
      ) : null}
    </div>
  )
}
