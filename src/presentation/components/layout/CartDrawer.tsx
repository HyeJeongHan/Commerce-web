'use client'

import { X, Trash2, ShoppingBag } from 'lucide-react'
import { useUIStore } from '@/presentation/store/ui.store'
import { useCart } from '@/presentation/hooks/useCart'
import { useAuthStore } from '@/presentation/store/auth.store'
import { formatPrice } from '@/shared/utils/format'
import { useCreateOrder } from '@/presentation/hooks/useOrders'
import Link from 'next/link'
import { ROUTES } from '@/shared/constants/routes'

export default function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore()
  const { cart, removeFromCart, isRemoving } = useCart()
  const { isAuthenticated } = useAuthStore()
  const createOrder = useCreateOrder()

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return
    const cartItemIds = cart.items.map((item) => item.id)
    await createOrder.mutateAsync({ cartItemIds })
    closeCart()
  }

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} />
            <span className="text-sm font-semibold tracking-wide uppercase">
              Cart ({cart?.items.length ?? 0})
            </span>
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-zinc-50 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={40} className="text-zinc-200" />
              <p className="text-sm text-zinc-500">로그인 후 장바구니를 이용할 수 있습니다.</p>
              <Link
                href={ROUTES.LOGIN}
                onClick={closeCart}
                className="text-xs font-semibold tracking-widest uppercase border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors"
              >
                Login
              </Link>
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={40} className="text-zinc-200" />
              <p className="text-sm text-zinc-500">장바구니가 비어있습니다.</p>
              <Link
                href={ROUTES.PRODUCTS}
                onClick={closeCart}
                className="text-xs font-semibold tracking-widest uppercase border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <ul className="space-y-6">
              {cart.items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <div className="w-20 h-24 bg-zinc-100 flex-shrink-0 rounded-sm overflow-hidden">
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-100" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug truncate">{item.product.name}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{item.product.categoryName ?? item.product.category?.name ?? ''}</p>
                    <p className="text-sm font-semibold mt-2">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-zinc-500">수량 {item.quantity}</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        disabled={isRemoving}
                        className="p-1 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {isAuthenticated && cart && cart.items.length > 0 && (
          <div className="px-6 py-5 border-t border-zinc-100 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-500">Total</span>
              <span className="text-lg font-bold">{formatPrice(cart.totalPrice)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={createOrder.isPending}
              className="w-full bg-black text-white text-xs font-semibold tracking-widest uppercase py-4 hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {createOrder.isPending ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
