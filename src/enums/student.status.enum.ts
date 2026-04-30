export const StudentStatus = {
  CANDIDATO: 'SEM_PRE_INSCRICAO',
  APROVADO: 'ADMITIDO_SEM_MATRICULA',
  REPROVADO: 'NAO_ADMITIDO',
  MATRICULADO: 'ALUNO_MATRICULADO',
};

export type StudentStatusType = typeof StudentStatus[keyof typeof StudentStatus]
