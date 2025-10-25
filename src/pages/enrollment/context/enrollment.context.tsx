import { createContext } from 'react'
import type { EnrollmentContextType } from '../types/enrollment'

export const EnrollmentContext = createContext<EnrollmentContextType | null>(
  null,
)
