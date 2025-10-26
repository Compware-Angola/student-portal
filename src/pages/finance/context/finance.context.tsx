import { createContext } from 'react'
import type { FinanceContextType } from '../type'

export const FinanceContext = createContext<FinanceContextType | null>(null)
