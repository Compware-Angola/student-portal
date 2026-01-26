import type { StudentSituationType } from '@/constants/student-situation'
import type { StudentType } from '@/utils/map-student-situation'
import { createContext, type Dispatch, type SetStateAction } from 'react'
export type StudentSituationValue = {
  situation: StudentSituationType | null
  studentType: StudentType | null
  isLoading: boolean
  hasError: boolean
  refetch: () => void
  setPreEnrollmentCode: Dispatch<SetStateAction<number | undefined>>
}
export const StudentSituationContext =
  createContext<StudentSituationValue | null>(null)
