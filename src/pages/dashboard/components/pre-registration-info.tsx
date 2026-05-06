import { AdmissionStatus } from "@/enums/admission.status.enum"

interface PreRegistrationInfoProps {
  studentStatus: string
}
const PreRegistrationInfo = ({ studentStatus }: PreRegistrationInfoProps) => {
  return (
    <>
      <p className="text-muted-foreground mt-2">
        {studentStatus === AdmissionStatus.SEM_ADMISSAO
          ? 'Candidato pré-inscrito - Aguardando exame de admissão'
          : studentStatus === AdmissionStatus.AGUARDANDO_DIA_DA_PROVA
            ? 'Exame realizado - Aguardando publicação dos resultados'
            : studentStatus === AdmissionStatus.ADMITIDO_SEM_MATRICULA
              ? 'Parabéns! Você foi admitido'
              : 'Resultado do exame de admissão'
        }
      </p>
    </>
  )
}
export { PreRegistrationInfo }
