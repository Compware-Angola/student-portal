import {
  getMonthlyFeesValue,
  type MonthlyFeeResponse,
} from '@/services/finance/get-monthly-fees-value.service'
import { useQuery } from '@tanstack/react-query'

type Params = {
  anoLetivo?: number
  curso?: number
  polo?: number
}

export function useQueryMonthlyFeesValue(params?: Params) {
  const queryKey = [
    'monthly-fees-value',
    params?.anoLetivo,
    params?.curso,
    params?.polo,
  ]

  const { data, isLoading, isFetching, isError, error, refetch } =
    useQuery<MonthlyFeeResponse>({
      queryKey,
      queryFn: async () => {
        if (!params?.anoLetivo || !params?.curso || !params?.polo) {
          throw new Error('Ano letivo, curso e polo são obrigatórios')
        }
        return getMonthlyFeesValue({
          anoLetivo: params.anoLetivo,
          curso: params.curso,
          polo: params.polo,
        })
      },
      enabled: Boolean(params?.anoLetivo && params?.curso && params?.polo),
      staleTime: 1000 * 60 * 10, // 10 minutos
      refetchInterval: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: 1,
    })

  return {
    data: data?.servicos ?? [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  }
}
