'use client'

import { use } from 'react'
import { useOrder, usePayOrder, useCancelOrder } from '@/presentation/hooks/useOrders'
import { useAuthStore } from '@/presentation/store/auth.store'
import OrderStatusBadge from '@/presentation/components/features/order/OrderStatusBadge'
import Spinner from '@/presentation/components/ui/Spinner'
import { formatPrice, formatDate } from '@/shared/utils/format'
import { ROUTES } from '@/shared/constants/routes'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default function OrderDetailPage({ params }: Props) {
  const { id } = use(params)
  const orderId = parseInt(id)
  const { isAuthenticated } = useAuthStore()
  const { data: order, isLoading } = useOrder(orderId)
  const payOrder = usePayOrder()
  const cancelOrder = useCancelOrder()

  if (!isAuthenticated) redirect(ROUTES.LOGIN)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size={32} />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-24 text-center">
        <p className="text-zinc-400">주문을 찾을 수 없습니다.</p>
        <Link href={ROUTES.ORDERS} className="mt-4 inline-block text-xs font-semibold uppercase tracking-widest underline underline-offset-4">
          Back to Orders
        </Link>
      </div>
    )
  }

  const canPay = order.orderStatus === 'PENDING'
  const canCancel = order.orderStatus === 'PENDING' || order.orderStatus === 'PAID'

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href={ROUTES.ORDERS} className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-black transition-colors mb-8">
        <ArrowLeft size={14} />
        All Orders
      </Link>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-10">
        <div>
          <p className="text-xs tracking-widest uppercase text-zinc-400 mb-1">주문번호 #{order.id}</p>
          <h1 className="text-3xl font-black uppercase tracking-tight">Order Detail</h1>
          <p className="text-xs text-zinc-400 mt-1">{formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.orderStatus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 py-4 border-b border-zinc-100">
              <div className="w-16 h-20 bg-zinc-100 flex-shrink-0 rounded-sm" />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.productName}</p>
                <p className="text-xs text-zinc-400 mt-1">수량 {item.quantity}</p>
                <p className="text-sm font-semibold mt-2">{formatPrice(item.subtotal)}</p>
              </div>
              <p className="text-sm text-zinc-400">{formatPrice(item.price)} / ea</p>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-zinc-50 p-6 self-start space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">상품 합계</span>
              <span>{formatPrice(order.totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">배송비</span>
              <span className="text-green-600">무료</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-zinc-200">
              <span>Total</span>
              <span>{formatPrice(order.totalPrice)}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {canPay && (
              <button
                onClick={() => payOrder.mutate(orderId)}
                disabled={payOrder.isPending}
                className="w-full bg-black text-white text-xs font-semibold tracking-widest uppercase py-3.5 hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {payOrder.isPending ? 'Processing...' : 'Pay Now'}
              </button>
            )}
            {canCancel && (
              <button
                onClick={() => cancelOrder.mutate(orderId)}
                disabled={cancelOrder.isPending}
                className="w-full border border-zinc-200 text-xs font-semibold tracking-widest uppercase py-3.5 hover:border-black transition-colors disabled:opacity-50"
              >
                {cancelOrder.isPending ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
