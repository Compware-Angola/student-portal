import { gaApi } from '@/lib/ga-api'

export interface FecthCurriculumPlanGradesResponse {
  matricula: Matricula
  gradesPendentes: Grade[]
  totalGradesPendentes: number
  gradesAFazer: Grade[]
  totalGradesAFazer: number
  isEspecializacao: boolean
  message: string
}

export interface Matricula {
  codigo_matricula: number
  estado: string
  nome_completo: string
  bi: string
  curso: string
  codigo_curso: number
  candidatura: string
}

export interface Grade {
  codigo: number
  semestre: string
  disciplina: string
  duracao: string
  nota: number | null
  codigo_disciplina: number
  codigo_classe: number
  classe: string
  codigo_grade_aluno: number | null
  existe_no_plano_atual: boolean
}
export type CurriculumPlanPendentProps = {
  academicYear: string,
  preEnrollmentCode?: number,
  newStudent: true,
  semestre?: number
}  | {
  academicYear: string,
  enrollmentCode?: number,
  newStudent: false,
  semestre: number
}
export async function fetchCurriculumPlanService(

  params: CurriculumPlanPendentProps
): Promise<FecthCurriculumPlanGradesResponse> {
    const searchParams = new URLSearchParams()
    searchParams.append('codigoAnoLectivo', params.academicYear)
    searchParams.append('alunoNovo', params.newStudent.toString())
    if(params.newStudent){
      searchParams.append('codigoPreInscricao', params.preEnrollmentCode!.toString())
    } else{
      searchParams.append('codigoMatricula', params.enrollmentCode!.toString())
    }
    if(params.semestre){
        searchParams.append('codigoSemestre', params.semestre.toString())
    }
  return gaApi
    .get('students/hanging-railings-and-to-be-made', {
      searchParams
    })
    .json<FecthCurriculumPlanGradesResponse>()
}

export async function fetchCurriculumPlanPosService({preEnrollmentCode, cycleCode}: {preEnrollmentCode: number, cycleCode: number}) {
  const searchParams = new URLSearchParams()
  searchParams.append('codigoPreInscricao', preEnrollmentCode.toString())
  searchParams.append('codigoCiclo', cycleCode.toString())
  return gaApi
    .get('students/hanging-railings-and-to-be-made/pos', {
      searchParams
    })
    .json<Grade[]>()
}