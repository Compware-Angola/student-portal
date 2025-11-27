import {
  getAcademicYearStudent,
  type AdemicsYear,
} from '@/services/academic-year/get-academic-year-student'
import { useQuery } from '@tanstack/react-query'

export function useQueryAcademicYearStudent(enrollmentCode?: string) {
  console.log(enrollmentCode)
  const { data, isLoading, error, isError } = useQuery<AdemicsYear>({
    queryKey: ['academic-year-student'],
    queryFn: () => {
      if (!enrollmentCode) {
        throw new Error('Enrollment code not provide')
      }
      return getAcademicYearStudent(enrollmentCode)
    },
    staleTime: Infinity,
    retry: 0,
    enabled: !!enrollmentCode,
  })

  return {
    data,
    isLoading,
    error,
    isError,
  }
}
