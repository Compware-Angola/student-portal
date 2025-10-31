
import { getmonthlyFee } from '@/services/finance/get-finance.service'
import type { MonthlyFeeDataResponse } from '@/types/finance-api-response'
import { useQuery } from '@tanstack/react-query'

export function useQueryFinanceMonthlyFee() {
  const { data, isLoading, error, isError } = useQuery<MonthlyFeeDataResponse>({
    queryKey: ['finance-monthly-fee'], 
    queryFn: () => getmonthlyFee(),  // Esta funcao deve ter os parametros 
    staleTime: Infinity,
    retry: 0,
  })

   return {
    data,
    isLoading,
    error,
    isError,
  }
}