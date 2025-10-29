import { curriculumPlanPendentsService } from '@/services/curriculum/curriculum-plan-pendents.service'
import type { CurriculumPlan } from '@/types/curriculum-plan'
import { useQuery } from '@tanstack/react-query'

export function useQueryCurriculumPlanPendents(preEnrollmentCode?: string) {
  const { data, isLoading, error, isError } = useQuery<CurriculumPlan>({
    queryKey: ['student-curriculum-plan-pendents', preEnrollmentCode],
    queryFn: async () => {
      if (!preEnrollmentCode) {
        throw new Error('Missing required parameters')
      }
      return curriculumPlanPendentsService(preEnrollmentCode)
    },
    retry: 0,
    enabled: !!preEnrollmentCode,
    staleTime: Infinity,
  })

  return {
    data: data?.grades ?? [],
    isLoading,
    error,
    isError,
  }
}
