import { Member } from '@/domain/entities/member.entity'
import { AUTH_STORE_KEY } from '@/shared/constants/auth'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  member: Member | null
  isAuthenticated: boolean
  _hasHydrated: boolean
  setMember: (member: Member | null) => void
  setHasHydrated: (v: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      member: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setMember: (member) => set({ member, isAuthenticated: !!member }),
      setHasHydrated: (v) => set({ _hasHydrated: v }),
      logout: () => set({ member: null, isAuthenticated: false }),
    }),
    {
      name: AUTH_STORE_KEY,
      // 민감 정보(member)는 저장하지 않고 인증 상태만 유지
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
