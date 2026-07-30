import { gaApi } from '@/lib/ga-api'

export type PrazoMatriculaCalendario = {
  data_inicio: string
  data_termino: string
  codigo_tipo_calendario: number
  descricao: string
}

export type FetchEnrollmentPeriodStudentsOldResponse = {
  semestre: number
  calendario: PrazoMatriculaCalendario[]
}

type FetchEnrollmentPeriodStudentsOldParams = {
  anoLectivo: number 
  codigoTipoCandidatura?: number
  isNewStudent?: number
}

export async function fetchEnrollmentAndRegistrationDeadlines({
  anoLectivo,
  codigoTipoCandidatura,
  isNewStudent
}: FetchEnrollmentPeriodStudentsOldParams): Promise<FetchEnrollmentPeriodStudentsOldResponse> {
   const response =  gaApi
    .get('academic-activities/enrollment-and-registration-deadlines', {
      searchParams: {
        anoLectivo: anoLectivo,
        codigoTipoCandidatura:codigoTipoCandidatura,
        isNewStudent:isNewStudent,
      },
    })
     .json<FetchEnrollmentPeriodStudentsOldResponse>()
  return response
}
