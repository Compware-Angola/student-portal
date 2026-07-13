import {
  type TipoCandidatura,
  fetchTipoCandidatura,
} from '@/services/dropdowns/fetch-tipo-candidatura'
import { useQuery } from '@tanstack/react-query'

export function useQueryTipoCandidatura() {
  return useQuery<TipoCandidatura[], Error>({
    queryKey: ['tiposCandidatura'],
    queryFn: fetchTipoCandidatura,
    staleTime: 5 * 60 * 1000,
  })
}
