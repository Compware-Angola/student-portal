import { getmonthlyFee } from '@/services/finance/get-finance.service'
import type { MonthlyFeeDataResponse } from '@/types/finance-api-response'
import { useQuery } from '@tanstack/react-query'

interface UseQueryFinanceMonthlyFeeParams {
  academicYear?: string
  enrollmentCode?: string
}

export function useQueryFinanceMonthlyFee({
  academicYear,
  enrollmentCode,
}: UseQueryFinanceMonthlyFeeParams) {
  const isEnabled = !!academicYear && !!enrollmentCode

  const { data, isLoading, error, isError } = useQuery<MonthlyFeeDataResponse>({
    queryKey: ['finance-monthly-fee', academicYear, enrollmentCode],
    queryFn: async () => {
      if (!academicYear || !enrollmentCode) {
        throw new Error('Monthly fee data is not available')
      }
      return getmonthlyFee(academicYear, enrollmentCode)
    },
    enabled: isEnabled,
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
