import { academicConfirmationNewStudentService } from '@/services/academic/confirmation-new-student.service'
import { useQuery } from '@tanstack/react-query'

type Params = {
  academicYearCode?: string
  candidacyType?: string
}

export function useQueryAcademicConfirmationNewStudent(
  params: Params,
  enable?: boolean,
) {
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

      return await academicConfirmationNewStudentService({
        academicYearCode: params.academicYearCode!,
        candidacyType: params.candidacyType!,
      })
    },
    retry: 0,
    enabled: Boolean(
      (params.academicYearCode && params.candidacyType) || enable,
    ),
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
