import type { FecthCurriculumPlanGradesResponse } from '@/services/curriculum/fetch-curriculum-plan.service'
import type { FetchEnrollmentPeriodStudentsOldResponse } from '@/services/prazos-matriculas/get-prazos-matriculas.service'
import type { DebtNegotiationResponse } from '@/services/renegotiation/renegotiation.service'

import type { GetConfirmationResponse } from '@/services/students/confirmation.service'
import type { StudentSituationResponse } from '@/services/students/situation.service'
import type { TypeServiceResponse } from '@/services/type-service/type-service.service'
import type { Grade } from '@/types/grade'
import type { ProfileData } from '@/types/profile'

export type RegistrationsUCContextType = {
  selectedSubjects: Grade[]
  isExpanded: {
    new: boolean
    pendents: boolean
  }
  totalValue: number
  toggleSubject: (subject: Grade) => void
  isSelected: (subject: Grade) => boolean
  toggleSection: (section: SectionKey) => void
  selectAll: () => void
  pendingSubjects: Grade[]
  isAllSelected: () => boolean
  remove: (codigoGrade: string) => void
  removeAll: () => void
  subject: Grade[]
  confirmStudentEnrollment: () => void
  confirmStudentEnrollmentState: boolean
  selectedSchedules: Record<string, SelectedSchedule>
  selectScheduleForSubject: (
    codigoGrade: string,
    horario: SelectedSchedule,
  ) => void
  removeScheduleForSubject: (codigoGrade: string) => void
  isLoadingStudentCurriculumPlan: boolean
  isErrorStudentCurriculumPlan: boolean
  isLoadingStudentCurriculumPlanPendents: boolean
  isErrorStudentCurriculumPlanPendents: boolean
  isLoadingProfileData: boolean
  isErrorProfileData: boolean
  enrollmentStatus: 'not_yet_open' | 'open' | 'closed'
  isLoadingAcademmicYear: boolean
  isErrorAcademicYear: boolean

  
  profileData: ProfileData | null
  maxCourseGrade: number
  isLoadingDebit: boolean
  debit?: DebtNegotiationResponse
  LateConfirmationValue: number
  LateConfirmation: TypeServiceResponse | null

    prazoValido:boolean,
        foraDoPrazo:boolean,
        aindaNaoComecou:boolean,
  totalPagar: number
  studentSituation?: StudentSituationResponse
  semestreActual : number | undefined
  curriculumPlan?: FecthCurriculumPlanGradesResponse,
  currentAcademicYear: number
  confirmationData: GetConfirmationResponse | undefined
  isLoadingConfirmation: boolean
  isErrorConfirmation: boolean
  enrollmentPeriodStudentsOld?: FetchEnrollmentPeriodStudentsOldResponse
}
export type SectionKey = 'new' | 'pendents'

export type SelectedSchedule = {
  codigoHorario: string
  descHorario: string
}

export type RegistrationsUCPayloadItem = {
  codigoGrade: string
  codigoHorario: string | null
  descHorario: string
}
