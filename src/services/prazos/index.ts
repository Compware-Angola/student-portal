import type { TipoCalendario } from '@/enums/tipo-calendario.enum'
import { gaApi } from '@/lib/ga-api'

export type PrazoData = {
  anoLectivo: number
  codigoStatus: number | null
  dataInicio: string | null
  dataFim: string | null
}

export type PrazoResponse = {
  status: 'ABERTO' | 'ENCERRADO' | 'NAO_DISPONIVEL' | 'NAO_CONFIGURADO'
  podeInscrever: boolean
  mensagem: string
  data: PrazoData
}

export type PrazoParams = {
  tipo: (typeof TipoCalendario)[keyof typeof TipoCalendario] | string
  anoLectivo?: string | number
}

export type PrazoByIdParams = {
  id: string | number
  anoLectivo?: string | number
}

/**
 * Busca informações de um prazo específico pelo tipo
 * @param params Parâmetros com tipo e ano lectivo
 * @returns {Promise<PrazoResponse>}
 *
 * @example
 * const result = await getPrazoPorTipo({
 *   tipo: TipoCalendario.AFECTACAO,
 *   anoLectivo: 23
 *   ano lectivo opcional se nao for enviado ele busca o actual activo no sitema
 * })
 */
export async function getPrazoPorTipo(
  params: PrazoParams,
): Promise<PrazoResponse> {
  const { tipo, anoLectivo } = params

  const queryParams = anoLectivo
    ? new URLSearchParams({
        tipo: tipo.toString(),
        anoLectivo: anoLectivo.toString(),
      })
    : new URLSearchParams({
        tipo: tipo.toString(),
      })

  return gaApi
    .get('prazos', { searchParams: queryParams })
    .json<PrazoResponse>()
}

/**
 * Busca informações de um prazo específico pelo ID
 * @param params Parâmetros com id e ano lectivo
 * @returns {Promise<PrazoResponse>}
 *
 * @example
 * const result = await getPrazoPorId({
 *   id: 12,
 *   anoLectivo: 23
 *   ano lectivo opcional se nao for enviado ele busca o actual activo no sitema
 * })
 */
export async function getPrazoPorId(
  params: PrazoByIdParams,
): Promise<PrazoResponse> {
  const { id, anoLectivo } = params

  const queryParams = anoLectivo
    ? new URLSearchParams({
        anoLectivo: anoLectivo.toString(),
      })
    : undefined

  return gaApi
    .get(`prazos/${id}`, { searchParams: queryParams })
    .json<PrazoResponse>()
}
