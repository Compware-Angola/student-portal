export type Schedule = {
  codigo_horario: string
  nome_horario: string
  capacidade: string
  codigo_gradecurricular: string
  nome_gradecurricular: string
  codigo_anolectivo: string
  nome_anolectivo: string
  semestre: string
  periodo_turno: string
  detalhes_aulas: LessonDetail[]
  disponivel_para_inscricao: string
  status_disponibilidade: string
  observacao: string
}

export type LessonDetail = {
  designacao: string
  tipo: string
  sala: string
  docente: string
  hora_inicio: string
  hora_termino: string
}
export type StudentSchedule = {
  codigo_inscricao: string
  matricula_aluno: string
  nome_disciplina: string
  nota_final: string
  codigo_horario: string
  nome_horario: string
  detalhes_aulas: LessonDetail[]
}

export type AcademicTest = {
  codigo: string
  data_prova: string
  hora_prova: string
  hora_termino: string
  duracao_prova: string
  vigilante: string | null
  estado: string
  tipo_prova: string
  modalidade: string
  sala: string
  periodo: string
  disciplina: string
}
