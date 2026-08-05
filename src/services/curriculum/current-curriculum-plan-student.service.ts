import { gaApi } from '@/lib/ga-api'

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
  enrollmentCode: string
  semester?:string
}

export async function currentCurriculumPlanStudentService(
  params: Params,
): Promise<StudentCurriculumPlan> {
  const searchParams = new URLSearchParams({
    academicYearCode: params.academicYearCode,
    enrollmentCode: params.enrollmentCode,
    ...(params.semester ? { semestre: params.semester } : {}),
  });

  return gaApi
    .get(`students/curriculum-plan-student?${searchParams.toString()}`)
    .json<StudentCurriculumPlan>();
}
