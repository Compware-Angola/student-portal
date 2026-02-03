import { createContext } from 'react'
import type { RegistrationsUCContextType } from '../types/registrations-uc'

export const RegistrationsUCContext =
  createContext<RegistrationsUCContextType | null>(null)
