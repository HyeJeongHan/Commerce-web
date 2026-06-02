import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import Header from '@/presentation/components/layout/Header'
import Footer from '@/presentation/components/layout/Footer'
import CartDrawer from '@/presentation/components/layout/CartDrawer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'ccomm', template: '%s | ccomm' },
  description: '프리미엄 온라인 커머스',
  icons: {
    icon: '/ccomm_light_icon.png',
    apple: '/ccomm_light_icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>
          <Header />
          <CartDrawer />
          <main className="pt-16 min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
