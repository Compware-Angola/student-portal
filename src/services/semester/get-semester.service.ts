import { apexApi } from '@/lib/apex-api'

type Semester = {
  designacao: string
  codigo: number
}
export type SemestersResponse = {
  items: Semester[]
}


export async function getSemesters(): Promise<SemestersResponse> {
  return apexApi.get('auto/fk2_tb_semestres').json<SemestersResponse>()
}