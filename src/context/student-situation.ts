import { createContext } from 'react'
export type StudentSituationValue = {
  hasEnrolmentCode: boolean
  isLoading: boolean
  hasError: boolean
  refetch: () => void
}
export const StudentSituationContext =
  createContext<StudentSituationValue | null>(null)
