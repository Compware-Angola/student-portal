import { gaApi } from '@/lib/ga-api'
import type { PreInscricaoFichaParams, PreInscricaoFichaResponse } from './type'

export async function getPreInscricaoFicha(
  params: PreInscricaoFichaParams,
): Promise<PreInscricaoFichaResponse> {
  const query = params.codigoPreinscricao
    ? `?codigoPreinscricao=${params.codigoPreinscricao}`
    : ''

  const response = await gaApi
    .get(`pre-inscricoes/ficha/${params.userId}${query}`)
    .json<PreInscricaoFichaResponse>()

  return response
}
