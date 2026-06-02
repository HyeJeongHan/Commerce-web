import { NextRequest, NextResponse } from 'next/server'
import { TOKEN_COOKIE, SESSION_COOKIE } from '@/shared/constants/auth'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'
const TOKEN_MAX_AGE = 30 * 60 // 30분

export async function POST(request: NextRequest) {
  const body = await request.json()

  const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status })
  }

  const response = NextResponse.json({ success: true, message: data.message, data: {} })

  // httpOnly 쿠키에 토큰 저장 — JS에서 접근 불가
  response.cookies.set(TOKEN_COOKIE, data.data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: TOKEN_MAX_AGE,
    path: '/',
  })

  // 비민감 세션 마커 — 클라이언트에서 로그인 여부 확인용
  response.cookies.set(SESSION_COOKIE, '1', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: TOKEN_MAX_AGE,
    path: '/',
  })

  return response
}
