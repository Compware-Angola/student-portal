// hooks/finance/use-query-finance-monthly-fee.ts

import { getmonthlyFee } from '@/services/finance/get-finance.service'
import type { MonthlyFeeDataResponse } from '@/types/finance-api-response'
import { useQuery } from '@tanstack/react-query'
// Importe o tipo de parâmetros (assumindo que seja MonthlyFeeQueryParams conforme definido anteriormente)
import type { MonthlyFeeQueryParams } from '@/services/finance/get-finance.service'

// Defina as props que o hook recebe (agora alinhado com o que getmonthlyFee precisa)
interface UseQueryFinanceMonthlyFeeParams {
  academicYear?: string
  enrollmentCode?: string
  // Adicione parâmetros de paginação se for usá-los no futuro (padrão é 1 e 10)
  page?: number
  limit?: number
}

export function useQueryFinanceMonthlyFee({
  academicYear,
  enrollmentCode,
  page = 1, // Definindo valor padrão aqui
  limit = 10, // Definindo valor padrão aqui
}: UseQueryFinanceMonthlyFeeParams) {

  // O Type Guard garante que só buscaremos se tivermos o mínimo necessário.
  const isEnabled = !!academicYear && !!enrollmentCode

  // 1. Constrói o objeto de parâmetros que será passado para getmonthlyFee
  const params: MonthlyFeeQueryParams = {
    academicYear: academicYear as string, // Cast seguro devido ao isEnabled
    enrollmentCode: enrollmentCode as string, // Cast seguro devido ao isEnabled
    page,
    limit,
  }

  // 2. A queryKey deve incluir todos os parâmetros que afetam o resultado
  const queryKey = ['finance-monthly-fee', params] // Usar o objeto params inteiro é mais limpo

  const { data, isLoading, error, isError } = useQuery<MonthlyFeeDataResponse>({
    queryKey: queryKey,
    queryFn: async () => {
      if (!isEnabled) {
        // Isso não deve ocorrer se 'enabled' for false, mas é um bom fallback
        throw new Error('Parâmetros de Ano Lectivo ou Matrícula estão faltando.')
      }

      // 3. Chama getmonthlyFee passando o objeto params completo
      return getmonthlyFee(params)
    },
    enabled: isEnabled, // Habilita/desabilita a query
    staleTime: Infinity, // Depende da sua estratégia de cache, Infinity é incomum
    retry: 0,
  })

  return {
    data,
    isLoading,
    error,
    isError,
  }
}