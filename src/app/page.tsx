import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ROUTES } from '@/shared/constants/routes'

const HERO_CATEGORIES = [
  {
    label: 'APPAREL',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    href: ROUTES.PRODUCTS,
  },
  {
    label: 'ACCESSORIES',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    href: ROUTES.PRODUCTS,
  },
  {
    label: 'FOOTWEAR',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    href: ROUTES.PRODUCTS,
  },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero — full-screen */}
      <section className="relative h-[calc(100vh-4rem)] flex items-end overflow-hidden bg-zinc-900">
        <img
          src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1600&q=80"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
          <p className="text-zinc-400 text-xs tracking-widest uppercase mb-4">New Collection 2026</p>
          <h1 className="text-white text-5xl sm:text-7xl md:text-8xl font-black tracking-[-0.04em] uppercase leading-none mb-8 max-w-2xl">
            Define Your Style
          </h1>
          <Link
            href={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-3 bg-white text-black text-xs font-semibold tracking-widest uppercase px-8 py-4 hover:bg-zinc-100 transition-colors"
          >
            Shop Now
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Marquee strip */}
      <div className="bg-black text-white py-3 overflow-hidden">
        <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite]">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="inline-block text-xs font-semibold tracking-widest uppercase mx-8">
              Free Shipping on Orders over ₩100,000 &nbsp;·&nbsp; New Arrivals Every Week &nbsp;·&nbsp; Premium Quality
            </span>
          ))}
        </div>
      </div>

      {/* Category grid */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs tracking-widest uppercase text-zinc-400 mb-1">Explore</p>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Categories</h2>
          </div>
          <Link href={ROUTES.PRODUCTS} className="text-xs font-semibold tracking-widest uppercase underline underline-offset-4 hover:no-underline transition-all hidden md:block">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HERO_CATEGORIES.map((cat) => (
            <Link key={cat.label} href={cat.href} className="group relative aspect-[4/5] overflow-hidden bg-zinc-100">
              <img
                src={cat.image}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-xl font-black tracking-[-0.02em] uppercase">{cat.label}</h3>
                <p className="text-zinc-300 text-xs tracking-widest uppercase mt-1 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Shop Now <ArrowRight size={12} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand statement */}
      <section className="bg-zinc-50 py-16 md:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs tracking-widest uppercase text-zinc-400 mb-4">Our Philosophy</p>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight mb-6">
              Crafted for those who move forward.
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed mb-8">
              Every piece in our collection is designed with intention — where function meets form, and quality speaks louder than trends.
              We believe in clothing that works as hard as you do.
            </p>
            <Link
              href={ROUTES.PRODUCTS}
              className="inline-flex items-center gap-3 border border-black text-black text-xs font-semibold tracking-widest uppercase px-8 py-4 hover:bg-black hover:text-white transition-colors"
            >
              Discover More
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Split banner */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"
            alt="New Season"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/50">
            <p className="text-white text-xs tracking-widest uppercase mb-2">Summer 2026</p>
            <h3 className="text-white text-2xl font-black uppercase">New Season</h3>
          </div>
        </div>
        <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden bg-black flex items-center justify-center p-12">
          <div className="text-center">
            <p className="text-zinc-400 text-xs tracking-widest uppercase mb-4">Members Only</p>
            <h3 className="text-white text-4xl font-black uppercase tracking-tight leading-none mb-6">
              Exclusive Access
            </h3>
            <p className="text-zinc-400 text-sm mb-8 max-w-xs mx-auto">
              Sign up and get early access to new drops, member-only discounts, and more.
            </p>
            <Link
              href={ROUTES.SIGNUP}
              className="inline-flex items-center gap-2 bg-white text-black text-xs font-semibold tracking-widest uppercase px-6 py-3 hover:bg-zinc-100 transition-colors"
            >
              Join Now <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
