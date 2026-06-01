'use client'

import Link from 'next/link'
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react'
import { useAuthStore } from '@/presentation/store/auth.store'
import { useUIStore } from '@/presentation/store/ui.store'
import { useCart } from '@/presentation/hooks/useCart'
import { ROUTES } from '@/shared/constants/routes'
import { useState } from 'react'

const NAV_LINKS = [
  { label: 'NEW', href: ROUTES.PRODUCTS },
  { label: 'PRODUCTS', href: ROUTES.PRODUCTS },
]

export default function Header() {
  const { isAuthenticated, logout } = useAuthStore()
  const { openCart } = useUIStore()
  const { totalItems } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-zinc-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="text-xl font-black tracking-[-0.05em] uppercase">
            COMMERCE
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-semibold tracking-widest uppercase text-zinc-600 hover:text-black transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href={ROUTES.PRODUCTS} className="p-2 hover:bg-zinc-50 rounded-full transition-colors">
              <Search size={18} />
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="p-2 hover:bg-zinc-50 rounded-full transition-colors">
                  <User size={18} />
                </button>
                <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-zinc-100 shadow-lg rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link href={ROUTES.ORDERS} className="block px-4 py-2.5 text-xs tracking-wide hover:bg-zinc-50">
                    주문 내역
                  </Link>
                  <button onClick={logout} className="block w-full text-left px-4 py-2.5 text-xs tracking-wide hover:bg-zinc-50">
                    로그아웃
                  </button>
                </div>
              </div>
            ) : (
              <Link href={ROUTES.LOGIN} className="p-2 hover:bg-zinc-50 rounded-full transition-colors">
                <User size={18} />
              </Link>
            )}

            <button
              onClick={openCart}
              className="relative p-2 hover:bg-zinc-50 rounded-full transition-colors"
            >
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu */}
            <button
              className="md:hidden p-2 hover:bg-zinc-50 rounded-full transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden border-t border-zinc-100 bg-white">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 text-xs font-semibold tracking-widest uppercase border-b border-zinc-50 hover:bg-zinc-50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
