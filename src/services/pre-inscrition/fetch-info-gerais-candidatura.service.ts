// src/services/pre-inscricao/fetch-info-gerais-candidatura.service.ts

import { gaApi } from '@/lib/ga-api'

/**
 * RESPONSE TYPE
 */
export type InfoGeraisCandidaturaResponse = {
  user_id: number
  nome_completo: string
  email: string
  telefone: string
  numero_documento: string
  codigo_preinscricao: number
  data_admissao: string | null
  data_prova: string | null
  hora_inicio: string | null
  hora_fim: string | null
  status_prova: string | null
  estado_aluno: string
  lista_de_provas: string[]
  sala_de_prova: string | null
  prova_id: number | null
  payments: {
    has_invoice: true
    is_payed: false
  }
}

/**
 * SERVICE
 */
export async function getInfoGeraisCandidaturaService(): Promise<InfoGeraisCandidaturaResponse> {
  const data = await gaApi
    .get('pre-inscricoes/candidatura/info-gerais')
    .json<InfoGeraisCandidaturaResponse>()

  return data
}
