import { api } from '@/lib/key'

type AuthResponse = {
  token: string
}

type AuthCredentials = {
  username: string
  password: string
}

export function authenticate(
  credentials: AuthCredentials,
): Promise<AuthResponse> {
  return api.post('v1/auth/login', { json: credentials }).json<AuthResponse>()
}
