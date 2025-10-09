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

export function logout(): Promise<void> {
  return api.post('v1/auth/logout').json<void>()
}

export function getProfile(): Promise<Profile> {
  return api.get('v1/auth/profile').json<Profile>()
}
