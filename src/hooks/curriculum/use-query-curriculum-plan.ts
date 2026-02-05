import { curriculumPlanService } from '@/services/curriculum/curriculumPlan.Service'
import type { CurriculumPlan } from '@/types/curriculum-plan'

import { useQuery } from '@tanstack/react-query'
type Params = {
  class?: string
  course?: string
  semestre?: number
  type?: 'old' | 'new'
}

export function useQueryCurriculumPlan({
  class: classes,
  type = 'new',
  semestre,
  course,
}: Params) {
  const { data, isLoading, error, isError } = useQuery<CurriculumPlan>({
    queryKey: ['student-curriculum-plan', classes, course, semestre],
    queryFn: async () => {
      if (!classes || !course) {
        throw new Error('Missing required parameters')
      }
      return curriculumPlanService({
        class: classes!,
        course: course!,
        semestre: semestre,
      })
    },
    retry: 0,
    enabled:
      type == 'old'
        ? Boolean(classes && course && semestre)
        : Boolean(classes && course),
    staleTime: Infinity,
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

export function useQueryCurriculumPlanCurrentYear(
  params: Omit<Params, 'type' | 'semestre'>,
  enabled?: boolean,
) {
  const { data, isLoading, error, isError } = useQuery<CurriculumPlan>({
    queryKey: [
      'student-curriculum-plan-current-year',
      params.class,
      params.class,
    ],
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
    enabled: Boolean(params.class && params.course && enabled),
    staleTime: Infinity,
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
