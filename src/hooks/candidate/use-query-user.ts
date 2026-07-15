import { getUser } from '@/services/auth/auth.service'
import { useQuery } from '@tanstack/react-query'

const AUTH_STORAGE_KEY = '@academico:auth'

export function useQueryUser() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  const auth = raw ? JSON.parse(raw) : null
  const userId = auth?.user_id

  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId as number),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}
