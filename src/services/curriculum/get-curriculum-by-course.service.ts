import { apexApi } from '@/lib/apex-api'
export type Disciplina = {
  disciplina: string
  semestre: string
  classe: string
  duracaoDisciplina: string
  codigoDisciplina: number
  codigoGrade: number
  valorInscricao: number
}

export type StudentCurriculumByCourse = {
  grades: Disciplina[]
}
type Params = {
  course: number
}

export async function StudentCurriculumByCourseService(
  params: Params,
): Promise<StudentCurriculumByCourse> {
  return apexApi
    .get(`curriculum/curriculum-plan/all/${params.course}`)
    .json<StudentCurriculumByCourse>()
}
