export type MemberRole = 'USER' | 'ADMIN'

export interface Member {
  id: number
  email: string
  name: string
  role: MemberRole
}
