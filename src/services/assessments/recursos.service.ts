import { gaApi } from '@/lib/ga-api'

export type Cadeira = {
  codigoGradeAluno: number
  gradeCurricula: number
  disciplina: string
  unidadeCurricular: string
  semestre: string
  duracao: string
  ano: string
  media: string
  resultado: string
  formula: string[]
  obs: string[]
}

export type ResultadoAluno = {
  total: number
  matricula: number
  anoLectivo: number
  nomeCompleto: string
  cadeiras: Cadeira[]
}

export type BaseParams = {
  anoLetivo: number
  matricula: number
}

export type GetCadeirasParams = BaseParams & {
  semestre?: number
}

export function getCadeirasRecurso({ anoLetivo, matricula }: BaseParams) {
  return gaApi
    .get(`students/provas/recurso/${anoLetivo}/${matricula}`)
    .json<ResultadoAluno>()
}

export type GradeRecursoAluno = {
  codigoGradeAluno: number
  codigoGrade: number
  unidadeCurricular: string
}

export type InscricaoRecursoPayload = {
  codigoMatricula: number
  gradesAlunos: GradeRecursoAluno[]
}

export function inscreverRecurso({
  codigoMatricula,
  gradesAlunos,
}: InscricaoRecursoPayload) {
  return gaApi
    .post(`students/provas/recurso/${codigoMatricula}`, {
      json: { gradesAlunos },
    })
    .json<void>()
}

export type CadeiraRecursoInscrita = {
  codigo_grade_aluno: number
  semestre: string
  disciplina: string
  codigo_disciplina: number
  codigo_grade: number
  classe: string
}

export type GetCadeirasInscritasResponse = {
  cadeirasInscritas: CadeiraRecursoInscrita[]
}

export function getCadeirasRecursoInscritas({
  anoLetivo,
  matricula,
}: BaseParams) {
  return gaApi
    .get(`students/provas/recurso/cadeiras-inscritas/${anoLetivo}/${matricula}`)
    .json<GetCadeirasInscritasResponse>()
}

export function getCadeirasEspecial({ anoLetivo, matricula }: BaseParams) {
  return gaApi
    .get(`students/provas/epoca-especial/${anoLetivo}/${matricula}`)
    .json<ResultadoAluno>()
}

export function getCadeirasEpocaEspecialInscritas({
  anoLetivo,
  matricula,
}: BaseParams) {
  return gaApi
    .get(
      `students/provas/epoca-especial/cadeiras-inscritas/${anoLetivo}/${matricula}`,
    )
    .json<GetCadeirasInscritasResponse>()
}

export type InscricaoEpocaEspecialPayload = {
  codigoMatricula: number
  gradesAlunos: GradeRecursoAluno[]
}

export function inscreverEpocaEspecial({
  codigoMatricula,
  gradesAlunos,
}: InscricaoEpocaEspecialPayload) {
  return gaApi
    .post(`students/provas/epoca-especial/${codigoMatricula}`, {
      json: { gradesAlunos },
    })
    .json<void>()
}
