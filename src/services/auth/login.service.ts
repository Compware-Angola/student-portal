import { apexApi } from '@/lib/apex-api'
import { authApi } from '@/lib/auth-api'

type AuthResponse = {
  token: string
  user_id: string
  user_name: string
  codigoPreinscricao: string
  hash: string
}

type AuthCredentials = {
  username: string
  password: string
}

export function login(credentials: AuthCredentials): Promise<AuthResponse> {
  return apexApi
    .post('autentication/login', { json: credentials })
    .json<AuthResponse>()
}

export function checkEmail(email: string): Promise<{ exists: boolean }> {
  return authApi
    .post('auth/check-email', { json: { email, platform: 'PORTAL' } })
    .json<{ email:string,exists: boolean }>()
}

export function requestPasswordReset(email: string): Promise<void> {
  return authApi
    .post('auth/send-change-password', { json: { email, platform: 'PORTAL' } })
    .then(() => {})
}

export function resetPassword(token: string, newPassword: string): Promise<void> {
  return authApi
    .post('auth/reset-password', {
      json: { token, newPassword, platform: 'PORTAL' },
    })
    .then(() => {})
}
