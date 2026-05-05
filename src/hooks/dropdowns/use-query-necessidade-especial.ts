import {
  fetchNecessidadesEspeciais,
  type NecessidadeEspecial,
} from '@/services/dropdowns/fetch-necessidade-especial.service'
import { useQuery } from '@tanstack/react-query'

export function useQueryNecessidadesEspeciais() {
  return useQuery<NecessidadeEspecial[]>({
    queryKey: ['necessidades-especiais-dropdown'],
    queryFn: fetchNecessidadesEspeciais,
    staleTime: 1000 * 60 * 10, // 10 min
    retry: 0,
  })
}
