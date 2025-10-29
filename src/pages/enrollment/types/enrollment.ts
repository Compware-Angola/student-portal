import type { Grade } from '@/types/grade'

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
  pendingSubjects: Grade[]
  isAllSelected: () => boolean
  error: Error | null
  isLoading: boolean
  remove: (codigoGrade: string) => void
  removeAll: () => void
  subject: Grade[]
  isError: boolean
  confirmStudentEnrollment: () => void
  confirmNewStudentEnrollmentPending: boolean
  selectedSchedules: Record<string, SelectedSchedule>
  selectScheduleForSubject: (
    codigoGrade: string,
    horario: SelectedSchedule,
  ) => void
  removeScheduleForSubject: (codigoGrade: string) => void
  getEnrollmentPayload: () => { grades: EnrollmentPayloadItem[] }
}
export type SectionKey = 'new' | 'pendents'

export type SelectedSchedule = {
  codigoHorario: string
  descHorario: string
}

export type EnrollmentPayloadItem = {
  codigoGrade: number
  codigoHorario: string | null
  descHorario: string
}
