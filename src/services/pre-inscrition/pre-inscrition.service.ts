import { invoiceApi } from '@/lib/invoice-api'
import type { PreInscricaoFichaParams, PreInscricaoFichaResponse } from './type'

export async function getPreInscricaoFicha(
    params: PreInscricaoFichaParams,
): Promise<PreInscricaoFichaResponse> {
    const response = await invoiceApi
        .get(`pre-inscricoes/ficha/${params.userId}`)
        .json<PreInscricaoFichaResponse>()

    return response
}