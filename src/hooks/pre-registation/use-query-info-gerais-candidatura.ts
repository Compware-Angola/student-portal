import {
  type InfoGeraisCandidaturaResponse,
  getInfoGeraisCandidaturaService,
} from '@/services/pre-inscrition/fetch-info-gerais-candidatura.service'
import { useQuery } from '@tanstack/react-query'

export const useQueryInfoGeraisCandidatura = (options?: {
  enabled?: boolean
}) => {
  const enabled = typeof options?.enabled === 'boolean' ? options.enabled : true

  return useQuery<InfoGeraisCandidaturaResponse>({
    queryKey: ['info-gerais-candidatura'],
    queryFn: getInfoGeraisCandidaturaService,
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })
}
