import { createContext, type Dispatch, type SetStateAction } from 'react'
export type StudentSituationValue = {
  hasEnrolmentCode: boolean
  isLoading: boolean
  hasError: boolean
  refetch: () => void
  setPreEnrollmentCode: Dispatch<SetStateAction<number | undefined>>
}
export const StudentSituationContext =
  createContext<StudentSituationValue | null>(null)
