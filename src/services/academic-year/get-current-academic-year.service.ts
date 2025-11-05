import { apexApi } from '@/lib/apex-api'

export type CurrentAcademicYear = {
  codresposta: number
  msgresposta: string
  codigo: string
  designacao: string
}

export async function getCurrentAcademicYear(): Promise<CurrentAcademicYear> {
  return apexApi.get('academic-year/current-year').json<CurrentAcademicYear>()
}
