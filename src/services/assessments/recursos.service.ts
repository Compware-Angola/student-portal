import { gaApi } from '@/lib/ga-api'
export type CaderiraRecuro = {
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
type GetCadeirasRecurosResponse = {
  total: number
  matricula: number
  anoLectivo: number
  nomeCompleto: string
  cadeiras: CaderiraRecuro[]
}
type GetCadeirasRecurosParams = {
  anoLetivo: number
  matricula: number
  semestre: number
}
export function getCadeirasRecuros({
  anoLetivo,
  matricula,
}: GetCadeirasRecurosParams) {
  const endpoint = `students/provas/recurso/${anoLetivo}/${matricula}`
  return gaApi.get(endpoint).json<GetCadeirasRecurosResponse>()
}
export type GradeRecursoAluno = {
  codigoGradeAluno: number
  codigoGrade: number
  unidadeCurricular: string
}
export type IncricaoRecuro = {
  codigoMatricula: number
  gradesAlunos: GradeRecursoAluno[]
}

export function incricaoRecuro(dados: IncricaoRecuro) {
  const { codigoMatricula, gradesAlunos } = dados
  const endpoint = `students/provas/recurso/${codigoMatricula}`
  return gaApi.post(endpoint, { json: { gradesAlunos } }).json<void>()
}

export type CadeiraRecursoInscrita = {
  codigo_grade_aluno: number
  semestre: string
  disciplina: string
  codigo_disciplina: number
  codigo_grade: number
  classe: string
}

type GetCadeirasInscritasResponse = {
  cadeirasInscristas: CadeiraRecursoInscrita[]
}

type GetCadeirasInscritasParams = {
  anoLetivo: number
  matricula: number
}

export function getCadeirasRecursoInscritas({
  anoLetivo,
  matricula,
}: GetCadeirasInscritasParams) {
  const endpoint = `students/provas/recurso/cadeiras-inscritas/${anoLetivo}/${matricula}`

  return gaApi.get(endpoint).json<GetCadeirasInscritasResponse>()
}
