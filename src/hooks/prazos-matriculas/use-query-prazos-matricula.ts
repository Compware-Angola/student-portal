import { fetchPrazosMatriculaService } from '@/services/prazos-matriculas/get-prazos-matriculas.service'
import { useQuery } from '@tanstack/react-query'

type Params = {
  anoLectivo?: number | string
}

export function useQueryPrazoMatricula(params: Params) {
  return useQuery({
    queryKey: ['prazos-matricula', params.anoLectivo],
    queryFn: () => fetchPrazosMatriculaService({
      anoLectivo: params.anoLectivo!
    }),
    enabled: !! params.anoLectivo
  })
}
