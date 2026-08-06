import { useContext } from 'react'
import { EnrollmentContext } from '../context/enrollment.context'

export const useEnrollment = () => {
  const context = useContext(EnrollmentContext)
  if (!context)
    throw new Error(
      'useEnrollment deve ser usado dentro de <EnrollmentProvider>',
    )
  return context
}
