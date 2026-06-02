'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/presentation/store/auth.store'
import { authRepository } from '@/infrastructure/repositories/auth.repository.impl'
import { useMutation } from '@tanstack/react-query'
import { ROUTES } from '@/shared/constants/routes'
import Spinner from '@/presentation/components/ui/Spinner'

const schema = z.object({
  currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요.'),
  newPassword: z.string().min(8, '새 비밀번호는 8자 이상이어야 합니다.'),
  confirmNewPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmNewPassword, {
  message: '새 비밀번호가 일치하지 않습니다.',
  path: ['confirmNewPassword'],
})
type FormValues = z.infer<typeof schema>

export default function AccountPage() {
  const { member, isAuthenticated, _hasHydrated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) router.replace(ROUTES.LOGIN)
  }, [_hasHydrated, isAuthenticated, router])

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: ({ currentPassword, newPassword }: FormValues) =>
      authRepository.changePassword({ currentPassword, newPassword }),
    onSuccess: () => {
      alert('비밀번호가 변경되었습니다.')
      reset()
    },
  })

  if (!_hasHydrated || !isAuthenticated) {
    return <div className="flex justify-center items-center min-h-[60vh]"><Spinner size={32} /></div>
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-xs tracking-widest uppercase text-zinc-400 mb-1">My Account</p>
        <h1 className="text-4xl font-black uppercase tracking-tight">Account</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* 프로필 정보 */}
        <div className="bg-zinc-50 p-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-6">Profile</h2>
          <div className="space-y-4">
            {[
              ['이름', member?.name],
              ['이메일', member?.email],
              ['등급', member?.role === 'ADMIN' ? 'Administrator' : 'Member'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm border-b border-zinc-200 pb-3">
                <span className="text-zinc-400 text-xs uppercase tracking-widest">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 비밀번호 변경 */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-6">비밀번호 변경</h2>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            {[
              { name: 'currentPassword' as const, label: '현재 비밀번호', placeholder: '••••••••' },
              { name: 'newPassword' as const, label: '새 비밀번호', placeholder: '8자 이상' },
              { name: 'confirmNewPassword' as const, label: '새 비밀번호 확인', placeholder: '비밀번호 재입력' },
            ].map(({ name, label, placeholder }) => (
              <div key={name}>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1.5 text-zinc-600">
                  {label}
                </label>
                <input
                  {...register(name)}
                  type="password"
                  placeholder={placeholder}
                  className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                />
                {errors[name] && (
                  <p className="mt-1 text-xs text-red-500">{errors[name]?.message}</p>
                )}
              </div>
            ))}

            {mutation.isError && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2">
                현재 비밀번호가 올바르지 않습니다.
              </p>
            )}
            {mutation.isSuccess && (
              <p className="text-xs text-green-600 bg-green-50 border border-green-100 px-3 py-2">
                비밀번호가 성공적으로 변경되었습니다.
              </p>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-black text-white text-xs font-semibold tracking-widest uppercase py-4 hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {mutation.isPending ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
