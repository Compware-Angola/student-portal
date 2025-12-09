import { useContext } from 'react'
import { RegistrationsUCContext } from '../context/registrations-uc.context'

export const useEnrollment = () => {
  const context = useContext(RegistrationsUCContext)
  if (!context)
    throw new Error(
      'useRegistrationsUC deve ser usado dentro de <RegistrationsUCProvider>',
    )
  return context
}
