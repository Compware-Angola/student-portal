import {
  getPrazoPorTipo,
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

