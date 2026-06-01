import Link from 'next/link'
import { ROUTES } from '@/shared/constants/routes'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-xs tracking-widest uppercase text-zinc-400 mb-4">Error 404</p>
      <h1 className="text-7xl md:text-9xl font-black uppercase tracking-[-0.05em] mb-4">404</h1>
      <p className="text-zinc-400 text-sm mb-8 max-w-sm">
        찾으시는 페이지가 존재하지 않습니다.
      </p>
      <Link
        href={ROUTES.HOME}
        className="text-xs font-semibold tracking-widest uppercase border border-black px-8 py-4 hover:bg-black hover:text-white transition-colors"
      >
        Go Home
      </Link>
    </div>
  )
}
