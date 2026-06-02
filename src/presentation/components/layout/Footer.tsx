import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-24">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-4">Company</p>
            <ul className="space-y-2">
              {['About Us', 'Careers', 'Press', 'Sustainability'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-4">Support</p>
            <ul className="space-y-2">
              {['Help Center', 'Shipping & Returns', 'Size Guide', 'Contact Us'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-4">Shop</p>
            <ul className="space-y-2">
              {['New Arrivals', 'Best Sellers', 'Sale', 'Collections'].map((item) => (
                <li key={item}>
                  <Link href="/products" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-4">Connect</p>
            <ul className="space-y-2">
              {['Instagram', 'TikTok', 'YouTube', 'Kakao'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <img src="/ccomm_light_card.png" alt="ccomm" className="h-8 w-auto brightness-0 invert" />
          <p className="text-xs text-zinc-500">© 2026 Commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
