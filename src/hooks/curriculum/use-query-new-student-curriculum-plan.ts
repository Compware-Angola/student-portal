import {
  newStudentCurriculumPlanService,
  type NewStudentCurriculumSubject,
} from '@/services/curriculum/new-student-curriculum-plan.service'

import { useQuery } from '@tanstack/react-query'

export function useQueryNewStudentCurriculumPlan(studentId: string) {
  const { data, isLoading, error } = useQuery<NewStudentCurriculumSubject[]>({
    queryKey: ['new-student-curriculum-plan', studentId],
    queryFn: () => newStudentCurriculumPlanService(studentId),
    enabled: !!studentId,
    staleTime: Infinity,
    retry: 0,
  })

  return {
    newStudentCurriculumPlan: data,
    isLoading,
    error,
  }
}
