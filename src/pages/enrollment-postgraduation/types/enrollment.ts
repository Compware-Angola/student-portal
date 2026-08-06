import type { StudentDashboardStatistics } from '@/services/statistics/dashboard'
import type { Grade } from '@/types/grade'
import type { ProfileData } from '@/types/profile'

export type EnrollmentContextType = {
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
  isAllSelected: () => boolean

  prazoValido: boolean,
  foraDoPrazo: boolean,
  aindaNaoComecou: boolean
  
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
  isLoadingProfileData: boolean
  isErrorProfileData: boolean

  enrollmentStatus: 'not_yet_open' | 'open' | 'closed'
  isLoadingAcademmicYear: boolean
  isErrorAcademicYear: boolean
  studentStatistics?: StudentDashboardStatistics
  isLoadingStudenttatistics: boolean
  profileData: ProfileData | null
  maxCourseGrade: number
  taxaMatriculaValue: number
  foraPrazoValue: number
  totalPagar: number
}
export type SectionKey = 'new' | 'pendents'

export type SelectedSchedule = {
  codigoHorario: string
  descHorario: string
}

export type EnrollmentPayloadItem = {
  codigoGrade: string
  codigoHorario: string | null
  descHorario: string
}