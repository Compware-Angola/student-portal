import { getEnrollmentsWithFilters } from '@/services/enrollment.service'
import { useQuery } from '@tanstack/react-query'

export function useGetEnrollmentsByRefId(refId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['enrollments', refId],
    queryFn: () => getEnrollmentsWithFilters({ search: refId }),
    staleTime: Infinity,
  })

  return {
    enrollments: data,
    isLoading,
    error,
  }
}
// refid eh idual codigo de matricula
