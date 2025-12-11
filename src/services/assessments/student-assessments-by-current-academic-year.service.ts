import { apexApi } from '@/lib/apex-api'

export type StudentAssessment = {
  media_final: string
  grade_aluno_id: string
  matricula_id: string
  turma_aluno: string | null
  estado_grade_aluno: string
  ano_letivo_id: string
  avaliacao_id: string
  nota_final: string
  nota_anterior: string
  data_criacao_avaliacao: string
  data_atualizacao_avaliacao: string
  tipo_prova_id: string
  tipo_avaliacao_id: string
  epoca_id: string
  status_avaliacao: string
  usuario_avaliador_id: string
  epoca_descricao: string
  tipo_avaliacao_nome: string
  tipo_avaliacao_categoria: string | null
  tipo_prova_categoria: string | null
  tipo_avaliacao_designacao: string
  grade_curricular_id: string
  curso_id: string
  disciplina_id: string
  semestre_id: string
  classe_id: string
  horas_totais: string
  status_grade_curricular: string
  disciplina_nome: string
  disciplina_sigla: string
  blockeado: boolean
}

export type StudentAssessmentResponse = {
  avaliacoes: StudentAssessment[]
}

type StudentAssessmentParams = {
  classe: string
  anoLetivo: string
  matricula: string
  semestre?: string
}

/**
 * Serviço para buscar avaliações de um aluno por classe, ano letivo e matrícula.
 */
export async function getStudentAssessmentsByCurrentAcademicYear(
  params: StudentAssessmentParams,
): Promise<StudentAssessmentResponse> {
  const semester = params.semestre
  const semesterParam = !semester ? '' : `?semestre=${semester}`
  const endpoint = `assessment/students/${params.classe}/${params.anoLetivo}/${params.matricula}${semesterParam}`
  return apexApi.get(endpoint).json<StudentAssessmentResponse>()
}
