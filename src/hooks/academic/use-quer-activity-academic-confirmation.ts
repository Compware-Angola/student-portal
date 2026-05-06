import { activityAcademicConfirmationStudentService } from '@/services/academic/activity-academic-confirmation-student.service'
import { useQuery } from '@tanstack/react-query'

type Params = {
  academicYearCode?: string
  candidacyType?: number
  type: 'old' | 'new'
}

export function useQueryActivityAcademicConfirmationStudent(params: Params) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      'academic-confirmation-new-student',
      params.academicYearCode,
      params.candidacyType,
    ],
    queryFn: async () => {
      if (!params.academicYearCode || !params.candidacyType) {
        throw new Error('Missing required parameters')
      }

      return await activityAcademicConfirmationStudentService({
        academicYearCode: params.academicYearCode!,
        candidacyType: params.candidacyType!,
        type: params.type,
      })
    },
    retry: 0,
    enabled: Boolean(params.academicYearCode && params.candidacyType),
    refetchInterval: 30 * 60 * 1000,
    staleTime: 30 * 60 * 1000,
  })

  return {
    data: data?.actividades ?? [],
    isLoading,
    isError,
    error,
  }
}
