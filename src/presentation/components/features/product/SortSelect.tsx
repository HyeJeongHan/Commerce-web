'use client'

import { ChevronDown } from 'lucide-react'

export type SortOption = 'default' | 'price_asc' | 'price_desc' | 'name_asc'

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: '기본 정렬' },
  { value: 'price_asc', label: '가격 낮은순' },
  { value: 'price_desc', label: '가격 높은순' },
  { value: 'name_asc', label: '이름순' },
]

interface Props {
  value: SortOption
  onChange: (v: SortOption) => void
}

export default function SortSelect({ value, onChange }: Props) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="appearance-none text-xs font-medium border border-zinc-200 px-4 py-2.5 pr-8 focus:outline-none focus:border-black transition-colors bg-white cursor-pointer"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" />
    </div>
  )
}
