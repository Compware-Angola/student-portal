import { PreResultCard } from './components/pre-result-card'
import { PreInscriptionCard } from './components/pre-inscription-card'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { PreRegistrationInfo } from './components/pre-registration-info'
import { useQueryInfoGeraisCandidatura } from '@/hooks/pre-registation/use-query-info-gerais-candidatura'
import { AdmissionStatus } from '@/enums/admission.status.enum'
import { ExamLoader } from '../prova-exame-acesso/components/exam-loader'

const PreIncriptionDashboard = () => {
  const { profileData } = useQueryProfile()

  const { data: info, isLoading } = useQueryInfoGeraisCandidatura()
  const status = info?.estado_aluno
  if (isLoading) {
    return <ExamLoader />
  }
  console.table(profileData)
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bem-vindo,{' '}
          {!profileData?.nome_completo ? '' : profileData?.nome_completo}
        </h1>
        <PreRegistrationInfo studentStatus={status!} />
      </div>

      {status === AdmissionStatus.AGUARDANDO_RESULTADO ||
      status === AdmissionStatus.ADMITIDO_SEM_MATRICULA ||
      status === AdmissionStatus.NAO_ADMITIDO ? (
        <>
          <PreResultCard studentStatus={status!} />
        </>
      ) : (
        <>
          <PreInscriptionCard />
        </>
      )}
    </div>
  )
}
export default PreIncriptionDashboard
