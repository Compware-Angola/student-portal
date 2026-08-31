import { authApi } from '@/lib/auth-api'

export interface PreInscricaoResumo {
  codigo_preinscricao: number
  codigo_curso: number | null
  curso: string | null
  codigo_tipo_candidatura: number | null
  tipo_candidatura: string | null
  sigla_tipo_candidatura: string | null
  polo: string | null
  data_preinscricao: string | null
  ano_lectivo: number | null
  estado: number | null
}

export async function getMyPreInscricoes(): Promise<PreInscricaoResumo[]> {
  return await authApi.get('auth/pre-inscricoes').json<PreInscricaoResumo[]>()
}
