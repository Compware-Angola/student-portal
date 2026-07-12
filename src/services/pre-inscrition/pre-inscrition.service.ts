import { gaApi } from '@/lib/ga-api'
import type { PreInscricaoFichaParams, PreInscricaoFichaResponse } from './type'

export async function getPreInscricaoFicha(
  params: PreInscricaoFichaParams,
): Promise<PreInscricaoFichaResponse> {
  const response = await gaApi
    .get(`pre-inscricoes/ficha/${params.userId}`)
    .json<PreInscricaoFichaResponse>()

  return response
}
