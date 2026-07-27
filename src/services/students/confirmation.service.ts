import { gaApi } from "@/lib/ga-api"
export type ConfirmationParams = {
  studentId: number
  academicYearCode: number
  semesterCode: number
}

export type Confirmation = {
  codigo_matricula: number
  codigo: number
  data_confirmacao: string
  estado: number
  classe: number
  canal: number
  semestre: number
}

export type ConfirmationInfo = {
  podeConfirmar: boolean
  confirmacao_status: number | null
  mensagens: string[]
}

export type GetConfirmationResponse = {
  confirmacao: Confirmation | null
  informacoes: ConfirmationInfo
}


export async function getConfirmation(
  {studentId, academicYearCode, semesterCode}: ConfirmationParams
  ): Promise<GetConfirmationResponse> {
    const searchParms = new URLSearchParams()
    if(academicYearCode) searchParms.set('codigoAnoLectivo', academicYearCode.toString())
    if(semesterCode) searchParms.set('codigoSemestre', semesterCode.toString())
    const data = await gaApi
      .get(`students/confirmation/${studentId}?${searchParms.toString()}`)
      .json<GetConfirmationResponse>()
    return data
  }
