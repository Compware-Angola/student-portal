import { curriculumPlanService } from '@/services/curriculum/curriculumPlan.Service'
import type { CurriculumPlan } from '@/types/curriculum-plan'
import { useQuery } from '@tanstack/react-query'
type Params = {
  class?: string
  course?: string
}
export function useQueryCurriculumPlan(params: Params, enabled?: boolean) {
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
    enabled: Boolean((params.class && params.course) || enabled),
    staleTime: Infinity,
  })

  return {
    data: data?.grades ?? [],
    isLoading,
    error,
    isError,
  }
}
