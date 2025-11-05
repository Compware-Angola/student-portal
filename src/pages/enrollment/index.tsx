import { toast } from 'sonner'
import { EnrollmentHeader } from './components/enrollment-header'
import { EnrollmentResume } from './components/enrollment-resume'
import { EnrollmentSection } from './components/enrollment-section'
import { EnrollmentSummaryCards } from './components/enrollment-summary-cards'
import { EnrollmentProvider } from './context/enrollment.provider'
import { useEnrollment } from './hooks/use-enrollment'
import { EnrollmentSkeleton } from './components/enrollment-skeleton'

import { Badge } from '@/components/ui/badge'
import { useEffect } from 'react'
import { StudentSituation } from '@/constants/student-situation'

function EnrollmentContent() {
  const {
    subject,
    isLoadingProfileData,
    isLoadingStudentCurriculumPlan,
    isLoadingStudentCurriculumPlanPendents,
    isErrorProfileData,
    isErrorStudentCurriculumPlan,
    isErrorStudentCurriculumPlanPendents,
    pendingSubjects,
    isNewStudentWithOutEnrollment,
    isLoadingAcademmicYear,
    studentSituation,
  } = useEnrollment()
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
    isLoadingAcademmicYear
  ) {
    return <EnrollmentSkeleton />
  }
  const enrollmentState =
    StudentSituation.NEW_WITH_CURRENT_CONFIRMATION ===
      Number(studentSituation?.codigo_status) ||
    StudentSituation.OLD_WITH_CURRENT_CONFIRMATION ===
      Number(studentSituation?.codigo_status)
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
                <Badge variant="outline">
                  {isNewStudentWithOutEnrollment
                    ? 'Aluno Novo'
                    : 'Aluno Antigo'}
                </Badge>
              </div>
            </div>
            <div className="space-y-6">
              <EnrollmentSection
                label="Novas"
                subjects={subject}
                secktionKey="new"
              />
              <EnrollmentSection
                label="Pendentes"
                subjects={pendingSubjects}
                secktionKey="pendents"
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
