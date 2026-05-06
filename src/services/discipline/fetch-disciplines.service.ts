import { gaApi } from '@/lib/ga-api'

export type Discipline = {
  disciplina: string
  codigo_disciplina: string
  semestre: string
  duracao: string
  classe: string
  estado_codigo: number;
  ano_lectivo: string
  codigo_horario: string
  sala: string
}

export type FetchDisciplinesResponse = {
  data: Discipline[]
  total: number
  page: number
  limit: number
  totalPages: number
}

type FetchDisciplinesParams = {
  anoLectivo: number | string
  semestre: number | string
  matriculaId: number | string
  page?: number
  limit?: number
}

export async function fetchDisciplinesService({
  anoLectivo,
  semestre,
  matriculaId,
  page = 1,
  limit = 10,
}: FetchDisciplinesParams): Promise<FetchDisciplinesResponse> {
  return gaApi
    .get('discipline', {
      searchParams: {
        anoLectivo: String(anoLectivo),
        semestre: String(semestre),
        matriculaId: String(matriculaId),
        page: String(page),
        ignorarEliminados: 1,
        limit: String(limit),
      },
    })
    .json<FetchDisciplinesResponse>()
}
