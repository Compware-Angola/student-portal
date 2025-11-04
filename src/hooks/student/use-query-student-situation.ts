import {
  getStudentSituation,
  type StudentSituationResponse,
} from '@/services/students/situation.service'
import { useQuery } from '@tanstack/react-query'

type Params = {
  preErrolmentCode?: string
}

/**
 * Hook React Query para listar as avaliações do aluno.
 * Refresca automaticamente a cada 10 minutos.
 */
export function useQueryStudentSituation(params?: Params) {
  const queryKey = ['student-situation', params?.preErrolmentCode]

  const { data, isLoading, isFetching, isError, error, refetch } =
    useQuery<StudentSituationResponse>({
      queryKey,
      queryFn: async () => {
        if (!params?.preErrolmentCode) {
          throw new Error('Classe, ano letivo e matrícula são obrigatórios')
        }

        return getStudentSituation({
          preErrolmentCode: params.preErrolmentCode,
        })
      },
      enabled: Boolean(params?.preErrolmentCode),
      staleTime: 1000 * 60 * 10, // 10 minutos
      refetchInterval: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: 1,
    })

  return {
    data: data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  }
}
