import type { PreInscricaoFichaResponse } from '@/services/pre-inscrition/type'
import { getPreInscricaoFicha } from '@/services/pre-inscrition/pre-inscrition.service'
import { useQuery } from '@tanstack/react-query'
import { AuthStorage } from '@/storage/auth-storage'

export function useQueryPreInscricaoFicha(userId: number | string) {
  const codigoPreinscricao = AuthStorage.getSelectedPreinscricao() ?? undefined

  const { data, isLoading, error, isError } =
    useQuery<PreInscricaoFichaResponse>({
      queryKey: ['pre-inscricao-ficha', userId, codigoPreinscricao],
      queryFn: () => getPreInscricaoFicha({ userId, codigoPreinscricao }),
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
