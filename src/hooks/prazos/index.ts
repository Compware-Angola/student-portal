import {
  getPrazoPorId,
  getPrazoPorTipo,
  type PrazoByIdParams,
  type PrazoParams,
} from '@/services/prazos'
import { useQuery } from '@tanstack/react-query'

export function useGetPrazoPorTipo(params: PrazoParams) {
  return useQuery({
    queryKey: ['prazo', params.tipo, params.anoLectivo],
    queryFn: () => getPrazoPorTipo(params),
  })
}

export function useGetPrazoPorId(params: PrazoByIdParams) {
  return useQuery({
    queryKey: ['prazo', params.id, params.anoLectivo],
    queryFn: () => getPrazoPorId(params),
  })
}

