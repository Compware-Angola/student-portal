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

function EnrollmentContent() {
  const {
    subject,
    isLoadingProfileData,
    isLoadingStudentCurriculumPlan,
    isErrorProfileData,
    isErrorStudentCurriculumPlan,
    isLoadingAcademmicYear,
    studentSituation,
    isLoadingStudenttatistics,
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
    isLoadingAcademmicYear ||
    isLoadingStudenttatistics ||
    !profileData
  ) {
    return <EnrollmentSkeleton />
  }

  return (
    <div className="space-y-6">
      <EnrollmentHeader />
      <EnrollmentSummaryCards />
      {!enrollmentState && (
        <>
          <div>
            <div className="space-y-6">
              <EnrollmentSection
                label="Disciplinas Disponíveis"
                subjects={subject}
                sectionKey="new"
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
