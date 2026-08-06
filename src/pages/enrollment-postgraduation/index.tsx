// enrollment.tsx
import { toast } from 'sonner'
import { useEffect } from 'react'

import { EnrollmentHeader } from './components/enrollment-header'
import { EnrollmentSummaryCards } from './components/enrollment-summary-cards'
import { EnrollmentSkeleton } from './components/enrollment-skeleton'
import { EnrollmentAvailable } from './components/enrollment-available'
import { EnrollmentDeadlineExpired } from './components/enrollment-deadline-expired'
import { EnrollmentStandardTimeframe } from './components/enrollment-standard-timeframe'
import { EnrollmentPostGraduationProvider } from './context/enrollment.provider'
import { useEnrollment } from './hooks/use-enrollment'

function EnrollmentContentPostGraduation() {
  const {
    subject,
    isLoadingProfileData,
    isLoadingStudentCurriculumPlan,
    isErrorProfileData,
    isErrorStudentCurriculumPlan,
    isLoadingAcademmicYear,
    isLoadingStudenttatistics,
    profileData,
    prazoValido,
    foraDoPrazo,
    aindaNaoComecou,
  } = useEnrollment()

  const isLoadingPage =
    isLoadingProfileData ||
    isErrorProfileData ||
    isLoadingStudentCurriculumPlan ||
    isLoadingAcademmicYear ||
    isLoadingStudenttatistics ||
    !profileData

  // Pode se matricular tanto dentro do prazo (grátis) quanto fora do prazo (pagando taxa)
  const podeMatricular = prazoValido || foraDoPrazo

  // Fora do prazo mas ainda pode se matricular mediante taxa
  const requerTaxa = foraDoPrazo

  useEffect(() => {
    if (isErrorProfileData) {
      toast.error('Erro ao carregar dados do estudante')
    }
    if (isErrorStudentCurriculumPlan) {
      toast.error('Erro ao carregar as grades curriculares')
    }
  }, [isErrorProfileData, isErrorStudentCurriculumPlan])

  if (isLoadingPage) {
    return <EnrollmentSkeleton />
  }

  return (
    <div className="space-y-6">
      <EnrollmentHeader />

      {podeMatricular ? (
        <EnrollmentSummaryCards /> // Pode matricular (dentro ou fora do prazo, com ou sem taxa)
      ) : (
        <EnrollmentStandardTimeframe /> // Ainda não começou ou fora do prazo sem possibilidade de matrícula
      )}

      {podeMatricular ? (
        <EnrollmentAvailable
          subject={subject}
          requerTaxa={requerTaxa} // sinaliza pro componente que essa matrícula exige pagamento de taxa
        />
      ) : (
        <EnrollmentDeadlineExpired
          aindaNaoComecou={aindaNaoComecou} // diferencia mensagem "ainda não começou" de "prazo expirado"
        />
      )}
    </div>
  )
}

export function EnrollmentPostGraduation() {
  return (
    <EnrollmentPostGraduationProvider>
      <EnrollmentContentPostGraduation />
    </EnrollmentPostGraduationProvider>
  )
}