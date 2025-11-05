// src/services/academic/academic-confirmation-new-student.service.ts
import { apexApi } from '@/lib/apex-api'

export type AcademicActivity = {
  codigo: string
  descricao: string
  data_inicio: string
  data_termino: string
  ano_lectivo: string
  tipo_candidatura: string
  tipo_calendario: string
}

export type AcademicActivitiesResponse = {
  actividades: AcademicActivity[]
}

/**
 * Serviço para buscar as atividades de confirmação/matrícula do novo estudante
 */
type Params = {
  academicYearCode: string
  candidacyType: string
  type: 'old' | 'new'
}

export async function activityAcademicConfirmationStudentService(
  params: Params,
): Promise<AcademicActivitiesResponse> {
  const type = params.type === 'old' ? 'oldstudent' : 'newstudent'
  return apexApi
    .get(
      `activity/academic/confirmation/${type}/${params.academicYearCode}/${params.candidacyType}`,
    )
    .json<AcademicActivitiesResponse>()
}
