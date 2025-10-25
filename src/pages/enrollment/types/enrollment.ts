import type { NewStudentCurriculumSubject } from '@/services/curriculum/new-student-curriculum-plan.service'

export type CurriculumData = {
  'I SEMESTRE': NewStudentCurriculumSubject[]
  'II SEMESTRE': NewStudentCurriculumSubject[]
}

export type ExpandedSections = {
  'ANUAL': boolean
  'I SEMESTRE': boolean
  'II SEMESTRE': boolean
}

export type EnrollmentContextType = {
  annual: NewStudentCurriculumSubject[]
  firstSemester: NewStudentCurriculumSubject[]
  secondSemester: NewStudentCurriculumSubject[]
  selectedSubjects: NewStudentCurriculumSubject[]
  expandedSections: ExpandedSections
  totalValue: number
  toggleSubject: (subject: NewStudentCurriculumSubject) => void
  isSelected: (subject: NewStudentCurriculumSubject) => boolean
  toggleSection: (section: keyof ExpandedSections) => void
  selectAll: () => void
  isAllSelected: () => boolean
  error: Error | null
  isLoading: boolean
  remove: (codigoGrade: string) => void
  removeAll: () => void
}
