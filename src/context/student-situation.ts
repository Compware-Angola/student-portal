import type { StudentSituationType } from '@/constants/student-situation'
import type { StudentType } from '@/utils/map-student-situation'
import { createContext } from 'react'
export type StudentSituationValue = {
  situation: StudentSituationType | null
  studentType: StudentType | null
  isLoading: boolean
  hasError: boolean
  refetch: () => void
}
export const StudentSituationContext =
  createContext<StudentSituationValue | null>(null)
