import { apexApi } from '@/lib/apex-api'

export type AcademicActivity = {
  codigo: string
  descricao: string
  data_inicio: string
  data_termino: string
  ano_lectivo: string
  tipo_candidatura: string
  tipo_calendario: string
}

export type AcademicActivityResponse = {
  actividades: AcademicActivity[]
}

type AcademicActivityParams = {
  academicYear: string
  applicationType: string
}

export async function getAcademicActivity(
  params: AcademicActivityParams,
): Promise<AcademicActivityResponse> {
  const endpoint = `activity/academic/${params.academicYear}/${params.applicationType}`
  return apexApi.get(endpoint).json<AcademicActivityResponse>()
}
