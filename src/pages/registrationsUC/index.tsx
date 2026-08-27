import { toast } from 'sonner'
import { RegistrationsUCtHeader } from './components/header'

import { EnrollmentSummaryCards } from './components/summary-cards'
import { RegistrationsUCProvider } from './context/registrations-uc.provider'

import { RegistrationsUCSkeleton } from './components/skeleton'

import { useEffect } from 'react'

import { PaymentAlert } from '@/components/payment-alert'
import { GraduatedBanner } from './components/graduated-banner'
import { useRegistrationsUC } from './hooks/use-registrations-uc'
import { StandardTimeframe } from './components/standard-timeframe'
import { RegistrationsUCAvailable } from './components/RegistrationsUCAvailable'
import { RegistrationsDeadlineExpired } from './components/RegistrationsDeadlineExpired'




function RegistrationsUCContent() {
  const {
    subject,
    isLoadingProfileData,
    isLoadingStudentCurriculumPlan,
    isLoadingStudentCurriculumPlanPendents,
    isErrorProfileData,
    isErrorStudentCurriculumPlan,
    isErrorStudentCurriculumPlanPendents,
    pendingSubjects,
    isLoadingAcademmicYear,
   
    isLoadingDebit,
    debit,
    profileData,
    confirmationData,
   
    prazoValido,
    foraDoPrazo,
    aindaNaoComecou,
  } = useRegistrationsUC()

  const isDiplomado = profileData?.estado_matricula === 'diplomado'



  const isLoadingPage =
    isLoadingProfileData ||
    isErrorProfileData ||
    isLoadingStudentCurriculumPlan ||
    isLoadingStudentCurriculumPlanPendents ||
    isLoadingAcademmicYear ||

    isLoadingDebit ||
    !profileData

  const podeConfirmar = confirmationData?.informacoes.podeConfirmar ?? false
 
  

  // Pode se inscrever tanto dentro do prazo (grátis) quanto fora do prazo (pagando taxa)
  const podeInscrever = podeConfirmar && (prazoValido || foraDoPrazo)

  

  // Fora do prazo mas ainda pode se inscrever mediante taxa
  const requerTaxa = podeConfirmar && foraDoPrazo

  useEffect(() => {
    if (isErrorProfileData) {
      toast.error('Erro ao carregar dados do estudante')
    }
    if (isErrorStudentCurriculumPlan) {
      toast.error('Erro ao carregar as grades curriculares')
    }
    if (isErrorStudentCurriculumPlanPendents) {
      toast.error('Erro ao carregar as grandes curriculares pendentes')
    }
  }, [
    isErrorProfileData,
    isErrorStudentCurriculumPlan,
    isErrorStudentCurriculumPlanPendents,
  ])

  if (isLoadingPage) {
    return <RegistrationsUCSkeleton />
  }

  if (debit && (debit?.totalDivida ?? 0) > 0) return <PaymentAlert debit={debit} />
  if (isDiplomado) return <GraduatedBanner />

  return (
    <div className="space-y-6">
      <RegistrationsUCtHeader />

      {confirmationData && (
        podeInscrever ? (
          <EnrollmentSummaryCards /> // Pode inscrição (dentro ou fora do prazo, com ou sem taxa)
        ) : (
          <StandardTimeframe /> // Dia a dia sem poder confirmar (ex: ainda não começou o período)
        )
      )}

      {confirmationData && podeConfirmar && (
        podeInscrever ? (
          <RegistrationsUCAvailable
            pendingSubjects={pendingSubjects}
            subject={subject}
            requerTaxa={requerTaxa} // sinaliza pro componente que essa inscrição exige pagamento de taxa
          />
        ) : (
          <RegistrationsDeadlineExpired
            aindaNaoComecou={aindaNaoComecou} // opcional: diferenciar mensagem "ainda não começou" de outros casos
          />
        )
      )}
    </div>
  )
}

export function RegistrationsUC() {
  return (
    <RegistrationsUCProvider>
      <RegistrationsUCContent />
    </RegistrationsUCProvider>
  )
}