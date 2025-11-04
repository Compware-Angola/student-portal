import { apexApi } from '@/lib/apex-api'

export type NewStudentConfirmationActivity = {
  codigo: string
  descricao: string
  data_inicio: string
  data_termino: string
  ano_lectivo: string
  tipo_candidatura: string
  tipo_calendario: string
}

export type NewStudentConfirmationActivityResponse = {
  actividades: NewStudentConfirmationActivity[]
}

type NewStudentConfirmationParams = {
  academicYear: string
  applicationType: string
}

export async function getNewStudentConfirmationActivity(
  params: NewStudentConfirmationParams,
): Promise<NewStudentConfirmationActivityResponse> {
  const endpoint = `academic/confirmation/newstudent/${params.academicYear}/${params.applicationType}`
  return apexApi.get(endpoint).json<NewStudentConfirmationActivityResponse>()
}
