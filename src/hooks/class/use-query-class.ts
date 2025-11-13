import { getClass, type ClassResponse } from '@/services/class/class'
import { useQuery } from '@tanstack/react-query'

export function useQueryClass() {
  const { data, isLoading, error, isError } = useQuery<ClassResponse>({
    queryKey: ['classes'],
    queryFn: () => getClass(),
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
