import { NextResponse } from 'next/server'
import { TOKEN_COOKIE, SESSION_COOKIE, REFRESH_TOKEN_COOKIE, HAS_REFRESH_COOKIE } from '@/shared/constants/auth'

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(TOKEN_COOKIE)
  response.cookies.delete(SESSION_COOKIE)
  response.cookies.delete(REFRESH_TOKEN_COOKIE)
  response.cookies.delete(HAS_REFRESH_COOKIE)
  return response
}
