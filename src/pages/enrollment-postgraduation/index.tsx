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
import { TIPOS_CANDIDATURA_SIGLA } from '@/constants/tipo-candidatura'
import { StudentStatus } from '@/enums/student.status.enum'
import { EnrollmentStatusBanner } from './components/enrollment-status-banner'

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

if (
    profileData &&
    (profileData.sigla_tipo_candidatura === TIPOS_CANDIDATURA_SIGLA.MESTRADO ||
      profileData.sigla_tipo_candidatura === TIPOS_CANDIDATURA_SIGLA.DOUTORAMENTO) &&
    profileData.estado_aluno === StudentStatus.ALUNO_MATRICULADO_MESTRADO_POS_GRADUACAO
  ) {
    return (
      <div className="space-y-6">
        <EnrollmentHeader />
        <EnrollmentStatusBanner profileData={profileData} />
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <EnrollmentHeader />
     
      {podeMatricular ? (
        <EnrollmentSummaryCards /> 
      ) : (
        <EnrollmentStandardTimeframe /> 
      )}

      {podeMatricular ? (
        <EnrollmentAvailable
          subject={subject}
          requerTaxa={requerTaxa}
        />
      ) : (
        <EnrollmentDeadlineExpired
          aindaNaoComecou={aindaNaoComecou}
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