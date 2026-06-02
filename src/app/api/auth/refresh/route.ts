import { NextRequest, NextResponse } from 'next/server'
import { TOKEN_COOKIE, SESSION_COOKIE, REFRESH_TOKEN_COOKIE, HAS_REFRESH_COOKIE } from '@/shared/constants/auth'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'
const ACCESS_MAX_AGE = 30 * 60
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value
  if (!refreshToken) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })

  if (!res.ok) {
    const response = NextResponse.json({ success: false }, { status: 401 })
    response.cookies.delete(TOKEN_COOKIE)
    response.cookies.delete(SESSION_COOKIE)
    response.cookies.delete(REFRESH_TOKEN_COOKIE)
    response.cookies.delete(HAS_REFRESH_COOKIE)
    return response
  }

  const data = await res.json()
  const isProd = process.env.NODE_ENV === 'production'
  const response = NextResponse.json({ success: true })

  response.cookies.set(TOKEN_COOKIE, data.data.accessToken, {
    httpOnly: true, secure: isProd, sameSite: 'strict',
    maxAge: ACCESS_MAX_AGE, path: '/',
  })
  response.cookies.set(SESSION_COOKIE, '1', {
    httpOnly: false, secure: isProd, sameSite: 'strict',
    maxAge: ACCESS_MAX_AGE, path: '/',
  })
  response.cookies.set(REFRESH_TOKEN_COOKIE, data.data.refreshToken, {
    httpOnly: true, secure: isProd, sameSite: 'strict',
    maxAge: REFRESH_MAX_AGE, path: '/',
  })
  response.cookies.set(HAS_REFRESH_COOKIE, '1', {
    httpOnly: false, secure: isProd, sameSite: 'strict',
    maxAge: REFRESH_MAX_AGE, path: '/',
  })

  return response
}
