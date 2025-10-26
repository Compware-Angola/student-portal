import { AuthStorage } from '@/storage/auth-storage'

export function useAuth() {
  const isAuthenticated = AuthStorage.isAuthenticated()

  return { isAuthenticated }
}
