import type { PreInscricaoFichaResponse } from '@/services/pre-inscrition/type'
import { getPreInscricaoFicha } from '@/services/pre-inscrition/pre-inscrition.service'
import { useQuery } from '@tanstack/react-query'

export function useQueryPreInscricaoFicha(userId: number | string) {
  const { data, isLoading, error, isError } =
    useQuery<PreInscricaoFichaResponse>({
      queryKey: ['pre-inscricao-ficha', userId],
      queryFn: () => getPreInscricaoFicha({ userId }),
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
