import {
  getAcademicYear,
  type AdemicsYear,
} from '@/services/academic-year/get-acamedic-year.service'
import { useQuery } from '@tanstack/react-query'

export function useQueryAcademicYear() {
  const { data, isLoading, error, isError } = useQuery<AdemicsYear>({
    queryKey: ['academic-year'],
    queryFn: () => getAcademicYear(),
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
