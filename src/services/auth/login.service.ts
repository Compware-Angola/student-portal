
import { authApi } from '@/lib/auth-api'
import { mailifyApi } from '@/lib/mailify-api';

type User = {
  id: number;
  name: string;
  telefone: string;
  email: string;
  tipo_de_documento: string | null;
  numero_documento: string | null;
  email_verified_at: string | null;
  remember_token: string | null;
  created_at: string;
  updated_at: string;
  canal: number;
  username: string;
  grauacademico: string | null;
  faculdade: string | null;
  estado: string | null;
  foto: string | null;
  motivo_bloqueio: string | null;
  status_: number;
  ano_lectivo_id: number;
  codigopreinscricao: number;
  nomecompleto: string;
};

type AuthResponse = {
  access_token: string;
  expires_in: number;
  user: User;
  mensagem: string;
};


type AuthCredentials = {
  username: string
  password: string
  platform?: string
}

export function login(credentials: AuthCredentials): Promise<AuthResponse> {
  return authApi
    .post('auth/login', { json: credentials })
    .json<AuthResponse>()
}

export function checkEmail(email: string): Promise<{ exists: boolean }> {
  return authApi
    .post('auth/check-email', { json: { email, platform: 'PORTAL' } })
    .json<{ email: string, exists: boolean }>()
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
  email: string;
  enrrolment: string;
  phone: string;
  details: string;
  platform: 'GA' | 'PORTAL';
}

export async function sendrenewDataRequest(payload: RequestDataUpdate) {
  await mailifyApi.post('send-email', {
    json: {

      subject: '[Portal UMA] Solicitação de Atualização de Dados Cadastrais',
      company: 'universidade_metodista_angola',
      type: 'solicitar_actualizacao_dados',
      context: {
        email: payload.email,
        enrrolment: payload.enrrolment,
        phone: payload.phone,
        platform: payload.platform,
        details: payload.details,
      },
    },
  });
}
