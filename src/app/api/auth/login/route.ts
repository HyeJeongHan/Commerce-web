import { NextRequest, NextResponse } from 'next/server'
import { TOKEN_COOKIE, SESSION_COOKIE, REFRESH_TOKEN_COOKIE, HAS_REFRESH_COOKIE } from '@/shared/constants/auth'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'
const ACCESS_MAX_AGE = 30 * 60        // 30분
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 // 7일

export async function POST(request: NextRequest) {
  const body = await request.json()

  const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  if (!res.ok) return NextResponse.json(data, { status: res.status })

  const response = NextResponse.json({ success: true, message: data.message, data: {} })
  const isProd = process.env.NODE_ENV === 'production'

  response.cookies.set(TOKEN_COOKIE, data.data.accessToken, {
    httpOnly: true, secure: isProd, sameSite: 'strict',
    maxAge: ACCESS_MAX_AGE, path: '/',
  })
  response.cookies.set(SESSION_COOKIE, '1', {
    httpOnly: false, secure: isProd, sameSite: 'strict',
    maxAge: ACCESS_MAX_AGE, path: '/',
  })

  if (data.data.refreshToken) {
    response.cookies.set(REFRESH_TOKEN_COOKIE, data.data.refreshToken, {
      httpOnly: true, secure: isProd, sameSite: 'strict',
      maxAge: REFRESH_MAX_AGE, path: '/',
    })
    response.cookies.set(HAS_REFRESH_COOKIE, '1', {
      httpOnly: false, secure: isProd, sameSite: 'strict',
      maxAge: REFRESH_MAX_AGE, path: '/',
    })
  }

  return response
}
