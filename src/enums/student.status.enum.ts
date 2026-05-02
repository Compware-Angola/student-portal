export const StudentStatus = {
  CANDIDATO: 'SEM_PRE_INSCRICAO',
  PREINSCRITO: 'PREINSCRITO',
  MATRICULADO: 'ALUNO_MATRICULADO',

};

export type StudentStatusType = typeof StudentStatus[keyof typeof StudentStatus]
