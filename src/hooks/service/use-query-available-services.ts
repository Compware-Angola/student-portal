import {
  getAcademicService,
  type AvailableServicesResponse,
  type GetAcademicServiceParams,
} from '@/services/academicService/academic-service.service'
import { useQuery } from '@tanstack/react-query'

type UseAvailableServicesParams = GetAcademicServiceParams

export function useQueryAvailableServices({
  descricao,
  codigoAnoLectivo,
  estado,
  visualizarNoPortal,
  tipoCandidatura,
  page = 1,
  limit = 10,
}: UseAvailableServicesParams) {
  const isEnabled = !!codigoAnoLectivo

  const { data, isLoading, error, isError } =
    useQuery<AvailableServicesResponse>({
      queryKey: [
        'availableServices',
        descricao,
        codigoAnoLectivo,
        estado,
        visualizarNoPortal,
        tipoCandidatura,
        page,
        limit,
      ],

      queryFn: async () => {
        if (!codigoAnoLectivo) {
          throw new Error('Academic services data is not available')
        }
        return getAcademicService({
          descricao,
          codigoAnoLectivo,
          estado,
          visualizarNoPortal,
          tipoCandidatura,
          page,
          limit,
        })
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