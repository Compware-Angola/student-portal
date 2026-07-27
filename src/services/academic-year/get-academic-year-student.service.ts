import { apexApi } from '@/lib/apex-api'
type AcademicYear = {
  codigo: string
  designacao: string
  estado: string
}

export type AdemicsYear = {
  anolectivos: AcademicYear[]
}

export async function getAcademicYearStudent(
  enrollmentCode: string,
): Promise<AdemicsYear> {
  return apexApi
    .get(`academic-year/student/${enrollmentCode}`)
    .json<AdemicsYear>()
}
