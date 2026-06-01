'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/presentation/hooks/useAuth'
import Link from 'next/link'
import { ROUTES } from '@/shared/constants/routes'

const schema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
})
type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const { login, isLoggingIn, loginError } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    try {
      await login(data)
    } catch {}
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left — decorative */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-zinc-900">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"
          alt="Login visual"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-16">
          <h2 className="text-white text-5xl font-black uppercase tracking-tight leading-none">
            Welcome<br />Back.
          </h2>
        </div>
      </div>

      {/* Right — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <p className="text-xs tracking-widest uppercase text-zinc-400 mb-2">Account</p>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-8">Sign In</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1.5 text-zinc-600">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="your@email.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1.5 text-zinc-600">
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                autoComplete="current-password"
                className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {loginError && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2">
                이메일 또는 비밀번호가 올바르지 않습니다.
              </p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-black text-white text-xs font-semibold tracking-widest uppercase py-4 hover:bg-zinc-800 transition-colors disabled:opacity-50 mt-2"
            >
              {isLoggingIn ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-zinc-400">
            계정이 없으신가요?{' '}
            <Link href={ROUTES.SIGNUP} className="text-black font-semibold underline underline-offset-2 hover:no-underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
