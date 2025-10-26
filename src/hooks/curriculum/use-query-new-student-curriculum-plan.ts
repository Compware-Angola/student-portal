import {
  newStudentCurriculumPlanService,
  type NewStudentCurriculumSubject,
} from '@/services/curriculum/new-student-curriculum-plan.service'
import { AuthStorage } from '@/storage/auth-storage'

import { useQuery } from '@tanstack/react-query'

export function useQueryNewStudentCurriculumPlan() {
  const auth = AuthStorage.get()
  const userId = auth?.user_id
  const { data, isLoading, error, isError } = useQuery<
    NewStudentCurriculumSubject[]
  >({
    queryKey: ['new-student-curriculum-plan', userId],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    queryFn: () => newStudentCurriculumPlanService(userId!),
    enabled: !!userId,
    staleTime: Infinity,
    retry: 0,
  })

  return {
    newStudentCurriculumPlan: data,
    isLoading,
    error,
    isError,
  }
}
