import type { StudentStatusType } from '@/enums/student.status.enum'
import { authApi } from '@/lib/auth-api'

export async function getProfile(): Promise<CurrentUserResponse> {
  return await authApi
    .get(`auth/current-user?platform=PORTAL`)
    .json<CurrentUserResponse>()
}

export interface Confirmacao {
  codigo: number
  codigo_matricula: number
  ano_lectivo: number
  estado: number
  classe: number
  cadeirante: string
  canal: number
}

export interface StudentProfile {
  user_id: number
  nome_completo: string
  email: string
  telefone: string
  numero_documento: string | null
  grau_academico: 'Mestrado' | 'Doutoramento' | 'Licenciatura'
  codigo_preinscricao: number

  nome_completo_1: string
  sexo: string
  data_nascimento: string

  email_1: string
  bilhete_identidade: string
  contactos_telefonicos: string

  saldo_reset: number
  saldo_reset_anter: number

  codigo_tipo_candidatura: number
  curso_candidatura: number

  codigo_admissao: number
  data_admissao: string
  media_final: number

  codigo_matricula: number
  data_matricula: string
  estado_matricula: string

  codigo_curso: number
  codigo_aluno: number

  curso: string
  max_cadeiras_curso: number

  turma: string | null
  sala: string | null

  periodo: string
  periodoid: number

  foto: string

  data_actualizacao: string

  poloid: number
  curso_duracao: number
  curso_duracao_candidatura: number

  polo: string
  curso_candidatura_designacao: string

  estado_aluno: StudentStatusType

  confirmacoes: Confirmacao[]
}

export interface CurrentUserResponse {
  isAuthenticated: boolean
  user: StudentProfile
  message: string
}
