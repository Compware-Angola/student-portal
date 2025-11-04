import {
  getNewStudentConfirmationActivity,
  type NewStudentConfirmationActivityResponse,
} from '@/services/academic/get-academic-enrollment-time.service'
import { useQuery } from '@tanstack/react-query'

type Params = {
  academicYear?: string
  applicationType?: string
}

/**
 * Hook React Query para listar atividades de confirmação de novos estudantes.
 * Refresca automaticamente a cada 10 minutos.
 */
export function useQueryNewStudentConfirmationActivity(params?: Params) {
  const queryKey = [
    'newstudent-confirmation-activity',
    params?.academicYear,
    params?.applicationType,
  ]

  const { data, isLoading, isFetching, isError, error, refetch } =
    useQuery<NewStudentConfirmationActivityResponse>({
      queryKey,
      queryFn: async () => {
        if (!params?.academicYear || !params?.applicationType) {
          throw new Error('Academic year and application type are required')
        }

        return getNewStudentConfirmationActivity({
          academicYear: params.academicYear,
          applicationType: params.applicationType,
        })
      },
      enabled: Boolean(params?.academicYear && params?.applicationType),
      staleTime: 1000 * 60 * 10, // 10 minutos
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
