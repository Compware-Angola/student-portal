import { api } from '@/lib/key'
import type { StudentProfile } from '@/types/profile'

export async function getProfile(): Promise<StudentProfile> {
  return await api.get('v1/auth/profile').json<StudentProfile>()
}
