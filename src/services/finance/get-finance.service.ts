// services/finance-api.ts ou similar

import { invoiceApi as Api } from '@/lib/invoice-api'
import type { MonthlyFeeDataResponse } from '@/types/finance-api-response'

// Tipos baseados na rota do frontend/backend
export interface MonthlyFeeQueryParams {
    academicYear: string; // Vai como codAnoLectivo
    enrollmentCode: string; // Vai como codigo_matricula
    status:string
    page?: number;
    limit?: number;
}


/**
 * Função para buscar os dados financeiros do estudante (mensalidades e referências)
 * usando Query Parameters, alinhada com a rota do backend.
 *
 * @param params {MonthlyFeeQueryParams} Contém ano letivo, código da matrícula, página e limite.
 * @returns {Promise<MonthlyFeeDataResponse>} 
 */
export async function getmonthlyFee({
    academicYear,
    enrollmentCode,
    status,
    page = 1, // Valores padrão para paginação
    limit = 10,
}: MonthlyFeeQueryParams): Promise<MonthlyFeeDataResponse> {

    // 1. Mapeia os nomes do frontend para os nomes do backend
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        codigo_matricula: enrollmentCode, // Mapeamento correto
        codAnoLectivo: academicYear,  
        status:status    // Mapeamento correto
    });
    
    // 2. Constrói a URL final: /financial/monthly-fees?codigo_matricula=...&codAnoLectivo=...
    const url = `financial/monthly-fees?${queryParams.toString()}`

    return Api
        .get(url)
        .json<MonthlyFeeDataResponse>()
}