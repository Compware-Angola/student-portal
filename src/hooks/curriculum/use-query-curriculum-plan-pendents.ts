import { curriculumPlanPendentsService } from '@/services/curriculum/curriculum-plan-pendents.service'
import type { CurriculumPlan } from '@/types/curriculum-plan'
import { useQuery } from '@tanstack/react-query'

type CurriculumPlanPendentProps = {
  preEnrollmentCode?: string,
  semestre?: number
}
export function useQueryCurriculumPlanPendents({preEnrollmentCode,semestre}: CurriculumPlanPendentProps) {
  const { data, isLoading, error, isError } = useQuery<CurriculumPlan>({
    queryKey: ['student-curriculum-plan-pendents', preEnrollmentCode],
    queryFn: async () => {
      if (!preEnrollmentCode) {
        throw new Error('Missing required parameters')
      }
      return curriculumPlanPendentsService({
        preEnrollmentCode,
        semestre
      })
    },
    retry: 0,
    enabled: !!preEnrollmentCode && !!semestre,
    staleTime: 1000*60*5
  })
  const formatGrade = (grades: CurriculumPlan['grades']) => {
    return grades.map((grade) => {
      if (grade.valorInscricao === 'None' || !grade.valorInscricao) {
        return {
          ...grade,

          valorInscricao: '1600',
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
