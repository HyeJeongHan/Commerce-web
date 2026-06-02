'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOrders } from '@/presentation/hooks/useOrders'
import { useAuthStore } from '@/presentation/store/auth.store'
import OrderStatusBadge from '@/presentation/components/features/order/OrderStatusBadge'
import Spinner from '@/presentation/components/ui/Spinner'
import { formatPrice, formatDate } from '@/shared/utils/format'
import { ROUTES } from '@/shared/constants/routes'
import { Package } from 'lucide-react'
import Link from 'next/link'

export default function OrdersPage() {
  const { isAuthenticated, _hasHydrated } = useAuthStore()
  const router = useRouter()
  const { data: orders, isLoading } = useOrders()

  // 하이드레이션 완료 후 미인증 시 리다이렉트
  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.replace(ROUTES.LOGIN)
    }
  }, [_hasHydrated, isAuthenticated, router])

  // 하이드레이션 전 또는 리다이렉트 대기 중
  if (!_hasHydrated || !isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size={32} />
      </div>
    )
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-xs tracking-widest uppercase text-zinc-400 mb-1">My Account</p>
        <h1 className="text-4xl font-black uppercase tracking-tight">Orders</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Spinner size={32} />
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Package size={48} className="text-zinc-200" />
          <p className="text-zinc-400 text-sm">주문 내역이 없습니다.</p>
          <Link
            href={ROUTES.PRODUCTS}
            className="text-xs font-semibold tracking-widest uppercase border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={ROUTES.ORDER(order.id)}
              className="block border border-zinc-100 p-6 hover:border-black transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-zinc-400 mb-1">주문번호 #{order.id}</p>
                  <p className="text-xs text-zinc-400">{formatDate(order.createdAt)}</p>
                </div>
                <OrderStatusBadge status={order.orderStatus} />
              </div>
              <div className="flex items-end justify-between">
                <p className="text-sm text-zinc-500">{order.items.length}개 상품</p>
                <p className="text-lg font-bold">{formatPrice(order.totalPrice)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
