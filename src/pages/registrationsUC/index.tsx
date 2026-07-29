import { toast } from 'sonner'
import { RegistrationsUCtHeader } from './components/header'
import { RegistrationsUCResume } from './components/resume'
import { RegistrationsUCSection } from './components/section'
import { EnrollmentSummaryCards } from './components/summary-cards'
import { RegistrationsUCProvider } from './context/registrations-uc.provider'

import { RegistrationsUCSkeleton } from './components/skeleton'

import { useEffect } from 'react'

import { PaymentAlert } from '@/components/payment-alert'
import { GraduatedBanner } from './components/graduated-banner'
import { useRegistrationsUC } from './hooks/use-registrations-uc'

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
    confirmationData

  } = useRegistrationsUC()
  const isDiplomado = profileData?.estado_matricula === 'diplomado'

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

      
  if (
    isLoadingProfileData ||
    isErrorProfileData ||
    isLoadingStudentCurriculumPlan ||
    isLoadingStudentCurriculumPlanPendents ||
    isLoadingAcademmicYear ||
    isLoadingStudenttatistics ||
    !profileData ||
    isLoadingDebit
  ) {
    return <RegistrationsUCSkeleton />
  }
  if (debit && (debit?.totalDivida ?? 0) > 0) return <PaymentAlert />
  if (isDiplomado) return <GraduatedBanner />
  return (
    <div className="space-y-6">
  <>
          <RegistrationsUCtHeader />
          <EnrollmentSummaryCards />
          {confirmationData && confirmationData.informacoes.podeConfirmar && (
            <>
              <div>
                <div>
                  <div className="flex items-center justify-between my-2">
                    <p>Disciplinas Disponíveis</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <RegistrationsUCSection
                    label="Pendentes"
                    subjects={pendingSubjects}
                    secktionKey="pendents"
                  />
                  <RegistrationsUCSection
                    label="Novas"
                    subjects={subject}
                    secktionKey="new"
                  />
                </div>
              </div>

              <RegistrationsUCResume />
            </>
          )}
        </>
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
