import {
  type PaymentInvoicePagedResponse, // <--- Tipagem de resposta do PagedResult
  // <--- Tipagem dos parâmetros (opcional, para tipar o useQueryPayments)
  getPayments,
} from '@/services/finance/get-payments.service' // Verifique o caminho real do seu arquivo

import { useQuery } from '@tanstack/react-query'

interface UseQueryPaymentsParams {
  academicYear?: string
  // Renomeado para refletir o nome do parâmetro no backend (Codigo_PreInscricao)
  preRegistrationCode?: string
  // Adicionado para suportar paginação
  page?: number
  limit?: number
}

export function useQueryPayments({
  academicYear,
  preRegistrationCode,
  page = 1, // Valor padrão para paginação
  limit = 10, // Valor padrão para paginação
}: UseQueryPaymentsParams) {
  // A query é habilitada apenas se o ano e o código de pré-inscrição estiverem presentes
  const isEnabled = !!academicYear && !!preRegistrationCode

  // O queryKey DEVE incluir page e limit para que o React Query saiba que
  // a query mudou quando a página mudar, forçando um novo fetch.
  const queryKey = [
    'finance-detailed-payments',
    academicYear,
    preRegistrationCode,
    page,
    limit,
  ]

  const { data, isLoading, error, isError } =
    useQuery<PaymentInvoicePagedResponse>({
      queryKey: queryKey,

      queryFn: async () => {
        if (!academicYear || !preRegistrationCode) {
          // Esta exceção é puramente uma segurança, pois o `enabled` já trata isso
          throw new Error('Academic year or pre-registration code is missing.')
        }

        // Chamando a nova função com o objeto de parâmetros
        return getPayments({
          academicYear,
          preRegistrationCode, // Usando o novo nome do parâmetro
          page,
          limit,
        })
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
