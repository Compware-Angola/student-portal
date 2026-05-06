import {
  getAcademicActivity,
  type AcademicActivityResponse,
} from '@/services/academic/get-academic-activity.service'
import { useQuery } from '@tanstack/react-query'

type Params = {
  academicYear?: string
  applicationType?: number
}

/**
 * Hook React Query para listar atividades académicas.
 * Refresca automaticamente a cada 10 minutos.
 */
export function useQueryAcademicActivity(params?: Params) {
  const queryKey = [
    'academic-activity',
    params?.academicYear,
    params?.applicationType,
  ]

  const { data, isLoading, isFetching, isError, error, refetch } =
    useQuery<AcademicActivityResponse>({
      queryKey,
      queryFn: async () => {
        if (!params?.academicYear || !params?.applicationType) {
          throw new Error('Academic year and application type are required')
        }

        return getAcademicActivity({
          academicYear: params.academicYear,
          applicationType: params.applicationType,
        })
      },
      enabled: Boolean(params?.academicYear && params?.applicationType),
      staleTime: 1000 * 60 * 10,
      refetchInterval: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: 1,
    })

  return {
    data: data?.actividades ?? [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  }
}
