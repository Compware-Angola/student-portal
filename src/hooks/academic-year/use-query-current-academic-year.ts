import { getCurrentAcademicYear, type CurrentAcademicYear } from '@/services/academic-year/get-current-academic-year.service'
import { useQuery } from '@tanstack/react-query'

export function useQueryCurrentAcademicYear() {
  const { data, isLoading, error, isError } = useQuery<CurrentAcademicYear>({
    queryKey: ['current-academic-year'],
    queryFn: () => getCurrentAcademicYear(),
    staleTime: Infinity,
    retry: 0,
  })

  return {
    data,
    isLoading,
    error,
    isError,
  }
}
