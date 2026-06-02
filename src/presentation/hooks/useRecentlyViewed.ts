'use client'

import { Product } from '@/domain/entities/product.entity'
import { useCallback, useEffect, useState } from 'react'

const KEY = 'recently_viewed'
const MAX = 8

function load(): Product[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<Product[]>([])

  useEffect(() => {
    setItems(load())
  }, [])

  const track = useCallback((product: Product) => {
    setItems((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id)
      const next = [product, ...filtered].slice(0, MAX)
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clear = useCallback(() => {
    localStorage.removeItem(KEY)
    setItems([])
  }, [])

  return { items, track, clear }
}
