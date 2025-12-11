import {
  createDebitNegotation,
  getDebit,
  type DebtNegotiationResponse,
  type RenegociacaoPayload,
} from '@/services/renegotiation/renegotiation.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

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
      enabled: Boolean(isEnabled),
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
type RenegociacaoVariables = {
  payload: RenegociacaoPayload
  enrollmentCode: string
}

export function useMutationNegotiation() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ payload, enrollmentCode }: RenegociacaoVariables) =>
      createDebitNegotation(enrollmentCode, payload),

    onSuccess: () => {
      toast.success('Negociação criada com sucesso!')
      queryClient.invalidateQueries({
        queryKey: ['create-renegotiation-debit'],
      })
    },

    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro ao criar Negociação de Dívida.'
      toast.error(message)
    },
  })

  return {
    createRenegotiation: mutation.mutate,
    createRenegotiationAsync: mutation.mutateAsync,
    createRenegotiationPending: mutation.isPending,
    createRenegotiationSuccess: mutation.isSuccess,
  }
}
