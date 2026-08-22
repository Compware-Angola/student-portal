import { getMyPreInscricoes } from '@/services/auth/pre-inscricoes.service'
import { useQuery } from '@tanstack/react-query'

export function useQueryPreInscricoes() {
  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ['pre-inscricoes'],
    queryFn: getMyPreInscricoes,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  })

  return {
    preInscricoes: data ?? [],
    isLoading,
    error,
    isError,
    refetch,
  }
}
