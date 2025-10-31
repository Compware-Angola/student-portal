import {
  getStudentDashboardStatistics,
  type StudentDashboardStatistics,
} from '@/services/statistics/dashboard'
import { useQuery } from '@tanstack/react-query'

/**
 * Hook React Query para buscar estatísticas do aluno (dashboard).
 * Atualiza a cada 5 minutos.
 */
export function useQueryStudentDashboardStatistics(enrollmentCode?: string) {
  const queryKey = ['student-dashboard-statistics', enrollmentCode]

  const { data, isLoading, isFetching, isError, error, refetch } =
    useQuery<StudentDashboardStatistics>({
      queryKey,
      queryFn: async () => {
        if (!enrollmentCode) {
          throw new Error('Código de matrícula é obrigatório')
        }
        return getStudentDashboardStatistics(enrollmentCode)
      },
      enabled: Boolean(enrollmentCode),
      staleTime: 1000 * 60 * 5,
      refetchInterval: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    })

  return {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  }
}
