'use client'

import { useEffect, useState } from 'react'
import { formatPrice } from '@/shared/utils/format'

interface Props {
  minPrice: number | undefined
  maxPrice: number | undefined
  onChange: (min: number | undefined, max: number | undefined) => void
}

export default function PriceRangeFilter({ minPrice, maxPrice, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [minInput, setMinInput] = useState(minPrice?.toString() ?? '')
  const [maxInput, setMaxInput] = useState(maxPrice?.toString() ?? '')

  // 부모에서 가격 초기화 시 입력값도 동기화
  useEffect(() => {
    setMinInput(minPrice?.toString() ?? '')
    setMaxInput(maxPrice?.toString() ?? '')
  }, [minPrice, maxPrice])

  const handleApply = () => {
    const min = minInput ? Number(minInput) : undefined
    const max = maxInput ? Number(maxInput) : undefined
    onChange(min, max)
    setOpen(false)
  }

  const handleReset = () => {
    setMinInput('')
    setMaxInput('')
    onChange(undefined, undefined)
    setOpen(false)
  }

  const isActive = minPrice !== undefined || maxPrice !== undefined

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`text-xs font-medium border px-4 py-2.5 transition-colors ${
          isActive ? 'bg-black text-white border-black' : 'border-zinc-200 hover:border-black'
        }`}
      >
        {isActive
          ? `${minPrice ? formatPrice(minPrice) : '0'} ~ ${maxPrice ? formatPrice(maxPrice) : '∞'}`
          : '가격 범위'}
      </button>

      {open && (
        <>
          {/* 드롭다운 외부 클릭 닫기 */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 left-0 z-20 bg-white border border-zinc-200 shadow-lg p-4 w-64">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3">가격 범위</p>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="number"
                value={minInput}
                onChange={(e) => setMinInput(e.target.value)}
                placeholder="최소"
                className="w-full border border-zinc-200 px-3 py-2 text-xs focus:outline-none focus:border-black"
              />
              <span className="text-zinc-300 flex-shrink-0">–</span>
              <input
                type="number"
                value={maxInput}
                onChange={(e) => setMaxInput(e.target.value)}
                placeholder="최대"
                className="w-full border border-zinc-200 px-3 py-2 text-xs focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleApply}
                className="flex-1 bg-black text-white text-xs font-semibold py-2 hover:bg-zinc-800 transition-colors"
              >
                적용
              </button>
              <button
                onClick={handleReset}
                className="flex-1 border border-zinc-200 text-xs py-2 hover:border-black transition-colors"
              >
                초기화
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
