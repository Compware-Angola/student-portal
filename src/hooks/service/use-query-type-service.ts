import type { SERVICE_TYPES } from '@/constants/service-type'
import {
  getTypeService,
  type GetTypeServiceParams,
  type TypeServiceResponse,
} from '@/services/type-service/type-service.service'
import { useQuery } from '@tanstack/react-query'

const FIVE_MINUTES = 5 * 60 * 1000
export function useTypeService(params?: GetTypeServiceParams, enabled = true) {
  return useQuery<TypeServiceResponse[]>({
    queryKey: ['type-service', params],
    queryFn: async () => await getTypeService(params),
    staleTime: FIVE_MINUTES,
    enabled,
  })
}
type ServicePairs = {
  [K in keyof typeof SERVICE_TYPES]: {
    sigla: (typeof SERVICE_TYPES)[K]['sigla']
    description: (typeof SERVICE_TYPES)[K]['description']
  }
}[keyof typeof SERVICE_TYPES]

type TypeServiceSingleParams = ServicePairs & { currentYearCode: number }

export function useTypeServiceSingle(params: TypeServiceSingleParams) {
  const { currentYearCode, description, sigla } = params

  const { data, isLoading, error } = useTypeService(
    {
      codigoAnoLectivo: currentYearCode,
      descricao: description,
      sigla,
      estado: 'Ativo',
    },
    Boolean(currentYearCode),
  )

  return {
    data: data?.[0] ?? null,
    isLoading,
    error,
  }
}
