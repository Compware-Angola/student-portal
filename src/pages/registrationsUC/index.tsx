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
    isLoadingStudenttatistics,
    isLoadingDebit,
    debit,
    profileData,
    confirmationData,
    prazosMatricula
  } = useRegistrationsUC()

  const isDiplomado = profileData?.estado_matricula === 'diplomado'

  const prazoValido = prazosMatricula?.calendario &&
    prazosMatricula.calendario.some(
      prazo =>
        new Date(prazo.data_inicio) <= new Date() &&
        new Date(prazo.data_termino) >= new Date()
    )


  const isLoadingPage =
    isLoadingProfileData ||
    isErrorProfileData ||
    isLoadingStudentCurriculumPlan ||
    isLoadingStudentCurriculumPlanPendents ||
    isLoadingAcademmicYear ||
    isLoadingStudenttatistics ||
    isLoadingDebit ||
    !profileData

 
  const podeConfirmar = confirmationData?.informacoes.podeConfirmar ?? false
  const podeMatricularAgora = podeConfirmar && prazoValido

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

  if (debit && (debit?.totalDivida ?? 0) > 0) return <PaymentAlert />
  if (isDiplomado) return <GraduatedBanner />

  return (
    <div className="space-y-6">
      <RegistrationsUCtHeader />

      {confirmationData && (
        podeMatricularAgora ? (
          <EnrollmentSummaryCards /> // Pode Matricular card
        ) : (
          <StandardTimeframe /> // Tela Do dia a dia sem poder confirmar
        )
      )}

      {confirmationData && confirmationData.informacoes.podeConfirmar && (
        podeMatricularAgora ? (
          <RegistrationsUCAvailable
            pendingSubjects={pendingSubjects}
            subject={subject}
          />  // Tela de Confirmação  onde tras as cadeiras
        ) : (
          <RegistrationsDeadlineExpired /> // Tela do dia a dia sem poder confirmar
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
