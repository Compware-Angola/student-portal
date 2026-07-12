export type PreInscricaoPayload = {
  cursoCandidatura: number
  modalidadeFrequencia: number
  nomeCompleto: string
  bilheteIdentidade: string
  dataEmissaoBI: string
  dataValidadeBI: string
  sexo: string
  dataNascimento: string
  estadoCivil: string
  contactosTelefonicos: string
  contactoDeEmergencia?: string
  moradaCompleta: string
  email: string
  instituicaoFormacaoAcesso?: number
  dataConclusao: string
  mediaFinal: number
  pai: string
  mae: string
  necessidadeEspecialId: number
  poloId: number
  cursoOpcional1Id: number
  cursoOpcional2Id: number
}

export type PreInscricaoResponse = {
  message: string
  data?: {
    id?: number
    codigoPreinscricao?: number
  }
}

import { gaApi } from '@/lib/ga-api'

export async function createPreInscricao(
  payload: PreInscricaoPayload,
) {
  return gaApi
    .post('pre-inscricoes', {
      json: payload,
    })
    .json<PreInscricaoResponse>()
}
