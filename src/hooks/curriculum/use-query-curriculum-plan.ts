import { curriculumPlanService } from '@/services/curriculum/curriculum-plan.service'
import type { CurriculumPlan } from '@/types/curriculum-plan'
import { useQuery } from '@tanstack/react-query'
type Params = {
  class?: string
  course?: string
}
export function useQueryCurriculumPlan(params: Params) {
  const { data, isLoading, error, isError } = useQuery<CurriculumPlan>({
    queryKey: ['student-curriculum-plan', params.class, params.class],
    queryFn: async () => {
      if (!params.class || !params.course) {
        throw new Error('Missing required parameters')
      }
      return curriculumPlanService({
        class: params.class!,
        course: params.course!,
      })
    },
    retry: 0,
    enabled: !!params.class && !!params.course,
    staleTime: Infinity,
  })

  return {
    data: data?.grades ?? [],
    isLoading,
    error,
    isError,
  }
}
