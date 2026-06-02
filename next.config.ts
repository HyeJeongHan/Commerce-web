import type { NextConfig } from 'next'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

// 백엔드로 프록시할 경로를 명시적으로 선언 — 내부/어드민 경로 노출 방지
const PROXIED_PATHS = [
  '/api/auth/:path*',
  '/api/products/:path*',
  '/api/categories/:path*',
  '/api/cart/:path*',
  '/api/orders/:path*',
  '/api/members/:path*',
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
  async rewrites() {
    return PROXIED_PATHS.map((source) => ({
      source,
      destination: `${API_URL}${source.replace(':path*', ':path*')}`,
    }))
  },
}

export default nextConfig
