import { apexApi } from '@/lib/apex-api'

export type NewStudentCurriculumSubject = {
  disciplina: string
  semestre: string
  classe: string
  duracaoDisciplina: 'Semestral' | 'Anual'
  codigoDisciplina: string
  codigoGrade: string
  valorInscricao: string
}

export async function newStudentCurriculumPlanService(
  studentCode: string,
): Promise<NewStudentCurriculumSubject[]> {
  return apexApi
    .get(`curriculum/curriculum-plan/newstudent/${studentCode}`)
    .json<NewStudentCurriculumSubject[]>()
}
