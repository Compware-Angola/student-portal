import { gaApi } from '@/lib/ga-api'

type User = {
  id: number
  name: string
  telefone: string
  email: string
  tipo_de_documento: string | null
  numero_documento: string | null
  email_verified_at: string | null
  remember_token: string | null
  created_at: string
  updated_at: string
  canal: number
  username: string
  grauacademico: string | null
  faculdade: string | null
  estado: string | null
  foto: string | null
  motivo_bloqueio: string | null
  status_: number
  ano_lectivo_id: number
  codigopreinscricao: number
  nomecompleto: string
  password_reset_required: number
}

export type AuthResponse = {
  access_token: string
  expires_in: number
  user: User
  mensagem: string
}

export type AuthCredentials = {
  username: string
  password: string
  platform?: string
}

function normalizeUser(raw: Record<string, any>): User {
  return {
    id: raw.id ?? raw.ID,
    name: raw.name ?? raw.NAME,
    telefone: raw.telefone ?? raw.TELEFONE,
    email: raw.email ?? raw.EMAIL,
    tipo_de_documento: raw.tipo_de_documento ?? raw.TIPO_DE_DOCUMENTO ?? null,
    numero_documento: raw.numero_documento ?? raw.NUMERO_DOCUMENTO ?? null,
    email_verified_at: raw.email_verified_at ?? raw.EMAIL_VERIFIED_AT ?? null,
    remember_token: raw.remember_token ?? raw.REMEMBER_TOKEN ?? null,
    created_at: raw.created_at ?? raw.CREATED_AT,
    updated_at: raw.updated_at ?? raw.UPDATED_AT,
    canal: raw.canal ?? raw.CANAL,
    username: raw.username ?? raw.USERNAME,
    grauacademico: raw.grauacademico ?? raw.GRAUACADEMICO ?? null,
    faculdade: raw.faculdade ?? raw.FACULDADE ?? null,
    estado: raw.estado ?? raw.ESTADO ?? null,
    foto: raw.foto ?? raw.FOTO ?? null,
    motivo_bloqueio: raw.motivo_bloqueio ?? raw.MOTIVO_BLOQUEIO ?? null,
    status_: raw.status_ ?? raw.STATUS_,
    ano_lectivo_id: raw.ano_lectivo_id ?? raw.ANO_LECTIVO_ID,
    codigopreinscricao: raw.codigopreinscricao ?? raw.CODIGOPREINSCRICAO,
    nomecompleto: raw.nomecompleto ?? raw.NOMECOMPLETO ?? raw.name ?? raw.NAME,
    password_reset_required:
      raw.password_reset_required ?? raw.PASSWORD_RESET_REQUIRED,
  }
}

export async function getUser(id: number): Promise<User> {
  const raw = await gaApi
    .get(`beginning-student-process/${id}`)
    .json<Record<string, any>>()
  return normalizeUser(raw)
}
