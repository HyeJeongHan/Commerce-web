import { Member } from '@/domain/entities/member.entity'
import { clearTokens } from '@/infrastructure/api/client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  member: Member | null
  isAuthenticated: boolean
  setMember: (member: Member | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      member: null,
      isAuthenticated: false,
      setMember: (member) => set({ member, isAuthenticated: !!member }),
      logout: () => {
        clearTokens()
        set({ member: null, isAuthenticated: false })
      },
    }),
    { name: 'auth-store' }
  )
)
