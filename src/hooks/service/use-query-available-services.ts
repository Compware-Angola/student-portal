import {
  getAcademicService,
  type AvailableServicesResponse,
} from '@/services/academicService/academic-service.service'
import { useQuery } from '@tanstack/react-query'

interface UseAvailableServicesParams {
  academicYear?: string
  poloId?: string
}

export function useQueryAvailableServices({
  academicYear,
  poloId,
}: UseAvailableServicesParams) {
  const isEnabled = !!academicYear && !!poloId

  const { data, isLoading, error, isError } =
    useQuery<AvailableServicesResponse>({
      queryKey: ['availableServices', academicYear, poloId],

      queryFn: async () => {
        if (!academicYear || !poloId) {
          throw new Error('Academic services data is not available')
        }
        return getAcademicService(academicYear, poloId)
      },

      enabled: isEnabled,
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
