import { gaApi } from "@/lib/ga-api"
export interface UsableAcademicYear {
  designacao: string
  datainicioprimeirosemestre: string
  datafimprimeirosemestre: string
  datainiciosegundosemestre: string
  datafimsegundosemestre: string
  estado: string
  data_ultima_atualizacao: string
  utilizador: number
  status_: number
  ordem: number | null
  epoca_exame_acesso: number
  codigo: number
  codigo_tipo_candidatura: number
  fase_anolectivo: string
  tipo_candidatura: string
}

export interface GetUsableAcademicYearResponse {
  data: UsableAcademicYear | null
}


export async function getUsableAcademicYear(
    candidateType: number,
  ): Promise<GetUsableAcademicYearResponse> {
    return gaApi
      .get(`academic-calendar/usable-anolectivo/${candidateType}`)
      .json<GetUsableAcademicYearResponse>()
  }
