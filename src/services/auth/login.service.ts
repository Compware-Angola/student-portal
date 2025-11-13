import { apexApi } from '@/lib/apex-api'

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
