'use client'

import { Product } from '@/domain/entities/product.entity'
import { useCallback, useEffect, useState } from 'react'

const KEY = 'wishlist'

function load(): Product[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function useWishlist() {
  const [items, setItems] = useState<Product[]>([])

  useEffect(() => {
    setItems(load())
  }, [])

  const toggle = useCallback((product: Product) => {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === product.id)
      const next = exists ? prev.filter((p) => p.id !== product.id) : [product, ...prev]
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const isWishlisted = useCallback(
    (productId: number) => items.some((p) => p.id === productId),
    [items]
  )

  return { items, toggle, isWishlisted }
}
