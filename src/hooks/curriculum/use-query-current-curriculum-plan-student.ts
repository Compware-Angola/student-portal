import {
  currentCurriculumPlanStudentService,
  type StudentCurriculumPlan,
} from '@/services/curriculum/current-curriculum-plan-student.service'

import { useQuery } from '@tanstack/react-query'
type Params = {
  academicYearCode?: string
  preEnrollmentCode?: string
  semester?:string
}
export function useQueryCurrentCurriculumPlanSudent(params: Params) {
  const { data, isLoading, error, isError } = useQuery<StudentCurriculumPlan>({
    queryKey: [
      'current-student-curriculum-plan',
      params.academicYearCode,
      params.preEnrollmentCode,
      params.semester

    ],
    queryFn: async () => {
      if (!params.academicYearCode || !params.academicYearCode) {
        throw new Error('Missing required parameters')
      }
      return currentCurriculumPlanStudentService({
        academicYearCode: params.academicYearCode!,
        preEnrollmentCode: params.preEnrollmentCode!,
        semester: params.semester
      })
    },
    retry: 0,
    enabled: !!params.academicYearCode && !!params.preEnrollmentCode,
    staleTime: Infinity,
  })
  const formatGrade = (grades: StudentCurriculumPlan['grades']) => {
    return grades.map((grade) => {
      if (grade.ValorInscricao === 'None' || !grade.ValorInscricao) {
        return {
          ...grade,
          ValorInscricao: '1600',
        }
      }
      return grade
    })
  }
  return {
    data: formatGrade(data?.grades ?? []),
    isLoading,
    error,
    isError,
  }
}
