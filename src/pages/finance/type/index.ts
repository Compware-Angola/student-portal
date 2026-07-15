'use client'

import type { ProfileData } from '@/types/profile'

export type Payment = {
  id: number
  month: string
  amount: string
  dueDate: string
  status: 'paid' | 'pending' | 'upcoming'
  reference: string | null
}

export type Invoice = {
  id: number
  number: string
  description: string
  amount: string
  date: string
  status: 'paid' | 'pending'
}

export type Reference = {
  id: number
  referenceNumber: string
  entity: string
  amount: string
  startDate: string
  expirationDate: string
  status: 'paid' | 'active'
}

export type FinanceContextType = {
  handleGenerateReference: (id: number) => void
  handleDownloadInvoice: (id: number) => void
  handleDownloadReference: (id: number) => void
  getStatusBadge: (status: string) => React.JSX.Element | null
  profileData: ProfileData | null
  profileError: Error | null
  isProfileError: boolean
  isLoadingProfileData: boolean
}
