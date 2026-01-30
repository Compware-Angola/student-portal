// hooks/discipline/use-fetch-disciplines.ts
import { useQuery } from '@tanstack/react-query'
import { fetchDisciplinesService } from '@/services/discipline/fetch-disciplines.service'

type Params = {
  anoLectivo: number | string
  semestre: number | string
  matriculaId: number | string
  page?: number
  limit?: number
}

export function useFetchDisciplines(params: Params) {
  return useQuery({
    queryKey: ['disciplines', params],
    queryFn: () => fetchDisciplinesService(params),
  })
}
