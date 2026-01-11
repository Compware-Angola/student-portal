import { invoiceApi } from "@/lib/invoice-api"


export type Discipline = {
  disciplina: string
  codigo_disciplina: string
  semestre: string
  duracao: string
  classe: string
  ano_lectivo: string
  horario: string
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
  return invoiceApi
    .get('discipline', {
      searchParams: {
        anoLectivo: String(anoLectivo),
        semestre: String(semestre),
        matriculaId: String(matriculaId),
        page: String(page),
        limit: String(limit),
      },

    })
    .json<FetchDisciplinesResponse>()
}
