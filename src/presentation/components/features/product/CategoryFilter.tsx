'use client'

import { Category } from '@/domain/entities/product.entity'

interface Props {
  categories: Category[]
  selectedId: number | null
  onSelect: (id: number | null) => void
}

export default function CategoryFilter({ categories, selectedId, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`text-xs font-semibold tracking-widest uppercase px-4 py-2 border transition-colors ${
          selectedId === null
            ? 'bg-black text-white border-black'
            : 'border-zinc-200 text-zinc-500 hover:border-black hover:text-black'
        }`}
      >
        ALL
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`text-xs font-semibold tracking-widest uppercase px-4 py-2 border transition-colors ${
            selectedId === cat.id
              ? 'bg-black text-white border-black'
              : 'border-zinc-200 text-zinc-500 hover:border-black hover:text-black'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
