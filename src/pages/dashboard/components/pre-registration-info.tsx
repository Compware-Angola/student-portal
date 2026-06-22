import { AdmissionStatus } from '@/enums/admission.status.enum'

interface PreRegistrationInfoProps {
  studentStatus: string
}

const STATUS_MESSAGES: Record<string, string> = {
  [AdmissionStatus.SEM_ADMISSAO]:
    'Candidato pré-inscrito - Aguardando exame de admissão',

  [AdmissionStatus.AGUARDANDO_DIA_DA_PROVA]:
    'Exame agendado - Aguardando o dia da prova',

  [AdmissionStatus.DIA_DA_PROVA]:
    'Hoje é o dia da prova de admissão',

  [AdmissionStatus.AGUARDANDO_RESULTADO]:
    'Exame realizado - Aguardando publicação dos resultados',

  [AdmissionStatus.ADMITIDO_SEM_MATRICULA]:
    'Parabéns! Você foi admitido. Efetue a sua matrícula para concluir o processo.',

  [AdmissionStatus.NAO_ADMITIDO]:
    'Infelizmente, não foi admitido neste processo seletivo.',

  [AdmissionStatus.ALUNO_MATRICULADO]:
    'Matrícula concluída com sucesso.',

  [AdmissionStatus.PREINSCRITO_MESTRADO_POS_GRADUACAO]:
    'Pré-inscrição de pós-graduação realizada. Aguardando avaliação documental.',
}

const PreRegistrationInfo = ({
  studentStatus,
}: PreRegistrationInfoProps) => {
  return (
    <p className="mt-2 text-muted-foreground">
      {STATUS_MESSAGES[studentStatus] ?? 'Estado não identificado'}
    </p>
  )
}

export { PreRegistrationInfo }