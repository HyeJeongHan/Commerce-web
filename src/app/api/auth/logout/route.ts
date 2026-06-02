import { NextResponse } from 'next/server'
import { TOKEN_COOKIE, SESSION_COOKIE } from '@/shared/constants/auth'

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(TOKEN_COOKIE)
  response.cookies.delete(SESSION_COOKIE)
  return response
}
