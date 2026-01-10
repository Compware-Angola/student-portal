import {
  getStudentSchedule,
  type StudentScheduleResponse,
} from '@/services/schedule/get-student-schedule.service'
import { useQuery } from '@tanstack/react-query'

type Params = {
  academicYear?: string
  preEnrollmentCode?: string
}

export function useQueryStudentSchedule(params?: Params, enabled = true) {
  const queryKey = [
    'student-schedule',
    params?.academicYear,
    params?.preEnrollmentCode,
  ]

  const { data, isLoading, error, isError, refetch } =
    useQuery<StudentScheduleResponse>({
      queryKey,
      queryFn: async () => {
        if (!params?.academicYear || !params?.preEnrollmentCode) {
          throw new Error('Academic year and pre-enrollment code are required')
        }
        return getStudentSchedule(params.academicYear, params.preEnrollmentCode)
      },
      enabled: Boolean(
        params?.academicYear && params?.preEnrollmentCode && enabled,
      ),
      staleTime: Infinity,
      retry: 0,
    })

  return {
    data: data?.horarios ?? [],
    isLoading,
    error,
    isError,
    refetch,
  }
}
