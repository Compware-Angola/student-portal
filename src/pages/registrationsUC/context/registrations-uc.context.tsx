import { createContext } from 'react'
import type { EnrollmentContextType } from '../types/enrollment'

export const RegistrationsUCContext =
  createContext<EnrollmentContextType | null>(null)
