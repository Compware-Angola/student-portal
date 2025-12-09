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
  semester?:string
}

export async function currentCurriculumPlanStudentService(
  params: Params,
): Promise<StudentCurriculumPlan> {
  const semester = params.semester
  const semesterParam = !semester ? '':`?semestre=${semester}`;
  return apexApi
    .get(
      `curriculum/curriculum-plan-student/${params.academicYearCode}/${params.preEnrollmentCode}${semesterParam}`,
    )
    .json<StudentCurriculumPlan>()
}
