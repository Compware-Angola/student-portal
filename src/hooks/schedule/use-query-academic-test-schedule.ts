import {
  getAcademicTestSchedule,
  type AcademicTestScheduleResponse,
} from '@/services/schedule/get-academic-test-schedule.service'
import { useQuery } from '@tanstack/react-query'

type Params = {
  academicYear?: string
  semester?: string
  enrollmentCode?: string
}

/**
 * Hook React Query para obter os horários de provas do aluno.
 */
export function useQueryAcademicTestSchedule(params?: Params) {
  const queryKey = [
    'academic-test-schedule',
    params?.academicYear,
    params?.semester,
    params?.enrollmentCode,
  ]

  const { data, isLoading, error, isError, refetch, isFetching } =
    useQuery<AcademicTestScheduleResponse>({
      queryKey,
      queryFn: async () => {
        if (
          !params?.academicYear ||
          !params?.semester ||
          !params?.enrollmentCode
        ) {
          throw new Error(
            'Academic year, semester and registration are required',
          )
        }

        return getAcademicTestSchedule({
          academicYear: params.academicYear,
          semester: params.semester,
          enrollmentCode: params.enrollmentCode,
        })
      },
      enabled: Boolean(
        params?.academicYear && params?.semester && params?.enrollmentCode,
      ),
      staleTime: Infinity,
      retry: 0,
    })

  return {
    data: data?.provas ?? [],
    isLoading,
    error,
    isError,
    refetch,
    isFetching,
  }
}
