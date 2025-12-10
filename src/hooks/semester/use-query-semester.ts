
import { getSemesters, type SemestersResponse } from '@/services/semester/get-semester.service'
import { useQuery } from '@tanstack/react-query'

export function useQuerySemesters() {
  const { data, isLoading, error, isError } = useQuery<SemestersResponse>({
    queryKey: ['semesters'],
    queryFn: () => getSemesters(),
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
