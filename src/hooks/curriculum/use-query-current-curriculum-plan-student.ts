import {
  currentCurriculumPlanStudentService,
  type StudentCurriculumPlan,
} from '@/services/curriculum/current-curriculum-plan-student.service'

import { useQuery } from '@tanstack/react-query'
type Params = {
  academicYearCode?: string
  preEnrollmentCode?: string
}
export function useQueryCurrentCurriculumPlanSudent(params: Params) {
  const { data, isLoading, error, isError } = useQuery<StudentCurriculumPlan>({
    queryKey: [
      'current-student-curriculum-plan',
      params.academicYearCode,
      params.preEnrollmentCode,
    ],
    queryFn: async () => {
      if (!params.academicYearCode || !params.academicYearCode) {
        throw new Error('Missing required parameters')
      }
      return currentCurriculumPlanStudentService({
        academicYearCode: params.academicYearCode!,
        preEnrollmentCode: params.preEnrollmentCode!,
      })
    },
    retry: 0,
    enabled: !!params.academicYearCode && !!params.preEnrollmentCode,
    staleTime: Infinity,
  })

  return {
    data: data?.grades ?? [],
    isLoading,
    error,
    isError,
  }
}
