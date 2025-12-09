import {
  StudentCurriculumByCourseService,
  type StudentCurriculumByCourse,
} from '@/services/curriculum/get-curriculum-by-course.service'

import { useQuery } from '@tanstack/react-query'
type Params = {
  course?: string
}
export function useQueryStudentCurriculumByCourse(params: Params) {
  const { data, isLoading, error, isError } =
    useQuery<StudentCurriculumByCourse>({
      queryKey: ['student-curriculum-by-course', params.course],
      queryFn: async () => {
        if (!params.course) {
          throw new Error('Missing required parameters')
        }
        return StudentCurriculumByCourseService({
          course: params.course,
        })
      },
      retry: 0,
      enabled: !!params.course,
      staleTime: Infinity,
    })

  return {
    data: data?.grades ?? [],
    isLoading,
    error,
    isError,
  }
}
