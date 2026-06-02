import { NextRequest, NextResponse } from 'next/server'
import { TOKEN_COOKIE } from '@/shared/constants/auth'

// Next.js Route Handler로 직접 처리하는 경로 (rewrite 프록시 대상 아님)
const NEXTJS_ROUTES = ['/api/auth/login', '/api/auth/logout']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/api/') &&
    !NEXTJS_ROUTES.some((p) => pathname.startsWith(p))
  ) {
    const token = request.cookies.get(TOKEN_COOKIE)?.value

    if (token) {
      const headers = new Headers(request.headers)
      headers.set('Authorization', `Bearer ${token}`)
      return NextResponse.next({ request: { headers } })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
