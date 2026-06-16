import type { TipoCalendario } from '@/enums/tipo-calendario.enum'
import { gaApi } from '@/lib/ga-api'

export type PrazoData = {
  anoLectivo: number
  codigoStatus: number | null
  dataInicio: string | null
  dataFim: string | null
}

export type PrazoResponse = {
  codigoTipoCandidatura:number
  status: 'ABERTO' | 'ENCERRADO' | 'NAO_DISPONIVEL' | 'NAO_CONFIGURADO'
  podeInscrever: boolean
  mensagem: string
  data: PrazoData
}

export type PrazoParams = {
  tipo: (typeof TipoCalendario)[keyof typeof TipoCalendario] | string
  anoLectivo?: string | number
  codigo_tipo_candidatura?:number
}

export type PrazoByIdParams = {
  id: string | number
  anoLectivo?: string | number
  codigo_tipo_candidatura?: number
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
  const { tipo, anoLectivo,codigo_tipo_candidatura } = params

  const queryParams = new URLSearchParams()
  if (tipo) {
    queryParams.append('tipo', tipo)
  }
  if (anoLectivo) {
     queryParams.append('anoLectivo', anoLectivo.toString())
  }
  if (codigo_tipo_candidatura) {
    queryParams.append('codigo_tipo_candidatura', codigo_tipo_candidatura.toString())
  }
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
  const { id, anoLectivo,codigo_tipo_candidatura } = params

  const queryParams = new URLSearchParams()
  if (anoLectivo) { queryParams.append('anoLectivo', anoLectivo.toString()) }
  if (codigo_tipo_candidatura) {queryParams.append("codigo_tipo_candidatura", codigo_tipo_candidatura.toString())}
    return gaApi
      .get(`prazos/${id}`, { searchParams: queryParams })
      .json<PrazoResponse>()
}
