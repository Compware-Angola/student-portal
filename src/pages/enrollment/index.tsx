import { toast } from 'sonner'
import { EnrollmentHeader } from './components/enrollment-header'
import { EnrollmentResume } from './components/enrollment-resume'
import { EnrollmentSection } from './components/enrollment-section'
import { EnrollmentSummaryCards } from './components/enrollment-summary-cards'
import { EnrollmentProvider } from './context/enrollment.provider'
import { useEnrollment } from './hooks/use-enrollment'
import { EnrollmentSkeleton } from './components/enrollment-skeleton'

import { useEffect } from 'react'
import { StudentSituation } from '@/constants/student-situation'
import { PaymentAlert } from '@/components/payment-alert'

function EnrollmentContent() {
  const {
    subject,
    isLoadingProfileData,
    isLoadingStudentCurriculumPlan,
    isLoadingStudentCurriculumPlanPendents,
    isErrorProfileData,
    isErrorStudentCurriculumPlan,
    isLoadingAcademmicYear,
    studentSituation,
    isLoadingStudenttatistics,
    isLoadingDebit,
    debit,
    profileData,
  } = useEnrollment()
  useEffect(() => {
    if (isErrorProfileData) {
      toast.error('Erro ao carregar dados do estudante')
    }
    if (isErrorStudentCurriculumPlan) {
      toast.error('Erro ao carregar as grades curriculares')
    }
  }, [isErrorProfileData, isErrorStudentCurriculumPlan])
  const enrollmentState =
    StudentSituation.NEW_WITH_CURRENT_CONFIRMATION ===
      Number(studentSituation?.codigo_status) ||
    StudentSituation.OLD_WITH_CURRENT_CONFIRMATION ===
      Number(studentSituation?.codigo_status)
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
    return <EnrollmentSkeleton />
  }
  if (debit && (debit?.totalDivida ?? 0) > 0) return <PaymentAlert />

  return (
    <div className="space-y-6">
      <EnrollmentHeader />
      <EnrollmentSummaryCards />
      {!enrollmentState && (
        <>
          <div>
            <div>
              <div className="flex items-center justify-between my-2">
                <p>Disciplinas Disponíveis</p>
              </div>
            </div>
            <div className="space-y-6">
              <EnrollmentSection
                label="Novas"
                subjects={subject}
                secktionKey="new"
              />
            </div>
          </div>

          <EnrollmentResume />
        </>
      )}
    </div>
  )
}

export function Enrollment() {
  return (
    <EnrollmentProvider>
      <EnrollmentContent />
    </EnrollmentProvider>
  )
}
