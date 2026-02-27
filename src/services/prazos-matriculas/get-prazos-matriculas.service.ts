import { gaApi } from '@/lib/ga-api'

export type PrazoMatriculaCalendario = {
  data_inicio: string
  data_termino: string
  codigo_tipo_calendario: number
  descricao: string
}

export type FetchPrazosMatriculaResponse = {
  semestre: number
  calendario: PrazoMatriculaCalendario[]
}

type FetchPrazosMatriculaParams = {
  anoLectivo: number | string
}

export async function fetchPrazosMatriculaService({
  anoLectivo,
}: FetchPrazosMatriculaParams): Promise<FetchPrazosMatriculaResponse> {
   const response =  gaApi
    .get('academic-activities/prazos-matricula', {
      searchParams: {
        anoLectivo: String(anoLectivo),
      },
    })
     .json<FetchPrazosMatriculaResponse>()
  return response
}
