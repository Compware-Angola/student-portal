import { apexApi } from '@/lib/apex-api'
type AcademicYear = {
  codigo: string
  designacao: string
}

export type AdemicsYear = {
  anolectivos: AcademicYear[]
}

export async function getAcademicYear(): Promise<AdemicsYear> {
  return apexApi.get('academic-year/all').json<AdemicsYear>()
}
