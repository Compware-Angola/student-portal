import { apexApi } from '@/lib/apex-api'

type Grade = {
  disciplina: string
  semestre: string
  classe: string
  nota: string
  estado: string
  duracaoDisciplina: string
  CodigoDisciplina: string
  CodigoGrade: string
  ValorInscricao: string
  ano_lectivo: string
}
export type StudentCurriculumPlan = {
  grades: Grade[]
}
type Params = {
  academicYearCode: string
  preEnrollmentCode: string
}

export async function currentCurriculumPlanStudentService(
  params: Params,
): Promise<StudentCurriculumPlan> {
  return apexApi
    .get(
      `curriculum/curriculum-plan-student/${params.academicYearCode}/${params.preEnrollmentCode}`,
    )
    .json<StudentCurriculumPlan>()
}
