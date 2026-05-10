export const StudentStatus = {
  CANDIDATO: 'SEM_PRE_INSCRICAO',
  PREINSCRITO: 'PREINSCRITO',
  MATRICULADO: 'ALUNO_MATRICULADO',
  ADMITIDO_SEM_MATRICULA: 'ADMITIDO_SEM_MATRICULA',
  DIPLOMADO: 'DIPLOMADO'
};

export type StudentStatusType = typeof StudentStatus[keyof typeof StudentStatus]
