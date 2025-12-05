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

export async function requestPasswordReset(email: string): Promise<void> {
  await authApi
    .post('auth/send-change-password', { json: { email, platform: 'PORTAL' } })
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await authApi
    .post('auth/reset-password', {
      json: { token, newPassword, platform: 'PORTAL' },
    })
}
export interface RequestDataUpdate {
  /** E-mail que o usuário quer usar/corrigir */
  email: string;

  /** Número de matrícula do estudante (obrigatório para identificação) */
  enrrolment: string;

  /** Telefone de contato com código de Angola */
  phone: string;

  /** Explicação detalhada do motivo da solicitação */
  details: string;

  /** Plataforma de origem */
  platform: 'GA'  | 'PORTAL'; 
}
export async function sendrenewDataRequest(peload: RequestDataUpdate){
  await authApi
    .post('auth/send-renew-data', { json: peload })

}
