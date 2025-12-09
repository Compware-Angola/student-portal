import { StudentSituationContext } from '@/context/student-situation'
import { useContext } from 'react'

export const useStudentSituation = () => {
  const context = useContext(StudentSituationContext)

  if (!context)
    throw new Error(
      'useStudentSituation must be used within a StudentSituationProvider',
    )

  return context
}
