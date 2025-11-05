import {
  getDebit,
  type DebtNegotiationResponse,
} from '@/services/renegotiation/renegotiation.service'
import { useQuery } from '@tanstack/react-query'

interface UseQueryDebitFeeParams {
  enrollmentCode?: string
  preinscricao?: string
  type: string
}

export function useQueryGetDebit({
  enrollmentCode,
  preinscricao,
  type,
}: UseQueryDebitFeeParams) {
  const isEnabled = !!preinscricao && !!enrollmentCode && !!type

  const { data, isLoading, error, isError } = useQuery<DebtNegotiationResponse>(
    {
      queryKey: ['renegotiation-debit', preinscricao, enrollmentCode, type],
      queryFn: async () => {
        if (!preinscricao || !enrollmentCode) {
          throw new Error('Monthly fee data is not available')
        }
        return getDebit({ enrollmentCode, preinscricao, type })
      },
      enabled: isEnabled,
      staleTime: Infinity,
      retry: 0,
    },
  )

  return {
    data,
    isLoading,
    error,
    isError,
  }
}
