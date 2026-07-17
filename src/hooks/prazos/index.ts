import {
  getPrazoPorId,
  getPrazoPorTipo,
  type PrazoByIdParams,
  type PrazoParams,
} from '@/services/prazos'
import { useQuery } from '@tanstack/react-query'

export function useGetPrazoPorTipo(params: PrazoParams, enabled=true) {
  return useQuery({
    queryKey: ['prazo', params.tipo, params.anoLectivo, params.codigo_tipo_candidatura],
    queryFn: () => getPrazoPorTipo(params),
    enabled: enabled,
  })
}

export function useGetPrazoPorId(params: PrazoByIdParams,enabled=true) {
  return useQuery({
    queryKey: ['prazo', params.id, params.anoLectivo, params.codigo_tipo_candidatura],
    queryFn: () => getPrazoPorId(params),
    enabled: enabled,
  })
}
