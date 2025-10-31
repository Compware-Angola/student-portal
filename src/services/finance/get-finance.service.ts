
import { apexApi } from '@/lib/apex-api' 
import type { MonthlyFeeDataResponse } from '@/types/finance-api-response' 

/**
 * Função para buscar os dados financeiros do estudante (mensalidades e referências).
 *
 * @returns {Promise<MonthlyFeeDataResponse>} 
 */
export async function getmonthlyFee(): Promise<MonthlyFeeDataResponse> {

  return apexApi
    .get('financial/monthly-fees/23/9735') 
    .json<MonthlyFeeDataResponse>()
}