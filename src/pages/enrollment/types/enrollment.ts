import type { NewStudentCurriculumSubject } from '@/services/curriculum/new-student-curriculum-plan.service'

export type EnrollmentContextType = {
  selectedSubjects: NewStudentCurriculumSubject[]
  isExpanded: boolean
  totalValue: number
  toggleSubject: (subject: NewStudentCurriculumSubject) => void
  isSelected: (subject: NewStudentCurriculumSubject) => boolean
  toggleSection: () => void
  selectAll: () => void
  isAllSelected: () => boolean
  error: Error | null
  isLoading: boolean
  remove: (codigoGrade: string) => void
  removeAll: () => void
  subject: NewStudentCurriculumSubject[]
  isError: boolean
  confirmStudentEnrollment: () => void
  confirmNewStudentEnrollmentPending: boolean
}
