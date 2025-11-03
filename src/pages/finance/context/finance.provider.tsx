'use client'

import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertCircle, CreditCard } from 'lucide-react'
import type { Payment, Reference } from '../type'
import type { ReactNode } from 'react'
import { FinanceContext } from './finance.context'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const {
    profileData,
    isLoading: isLoadingProfileData,
    error: profileError,
    isError: isProfileError,
  } = useQueryProfile()
  const payments: Payment[] = [
    {
      id: 1,
      month: 'Janeiro 2025',
      amount: '45.000,00 Kz',
      dueDate: '2025-01-10',
      status: 'paid',
      reference: 'REF-2025-01-001',
    },
    {
      id: 2,
      month: 'Fevereiro 2025',
      amount: '45.000,00 Kz',
      dueDate: '2025-02-10',
      status: 'paid',
      reference: 'REF-2025-02-001',
    },
    {
      id: 3,
      month: 'Março 2025',
      amount: '45.000,00 Kz',
      dueDate: '2025-03-10',
      status: 'pending',
      reference: null,
    },
    {
      id: 4,
      month: 'Abril 2025',
      amount: '45.000,00 Kz',
      dueDate: '2025-04-10',
      status: 'upcoming',
      reference: null,
    },
  ]

  const references: Reference[] = [
    {
      id: 1,
      referenceNumber: 'REF-2025-01-001',
      entity: '10065',
      amount: '45.000,00 Kz',
      startDate: '2025-01-01',
      expirationDate: '2025-01-10',
      status: 'paid',
    },
    {
      id: 2,
      referenceNumber: 'REF-2025-02-001',
      entity: '10065',
      amount: '45.000,00 Kz',
      startDate: '2025-02-01',
      expirationDate: '2025-02-10',
      status: 'paid',
    },
    {
      id: 3,
      referenceNumber: 'REF-2025-03-001',
      entity: '10065',
      amount: '45.000,00 Kz',
      startDate: '2025-03-01',
      expirationDate: '2025-03-10',
      status: 'active',
    },
  ]

  const handleGenerateReference = (id: number) =>

    alert(`Gerando referência para pagamento:${id}`)
    console.log('Gerando referência para pagamento:', )
  const handleDownloadInvoice = (id: number) =>
    console.log('Baixando fatura:', id)
  const handleDownloadReference = (id: number) =>
    console.log('Baixando referência:', id)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-success/10 text-success hover:bg-success/20">
            <CheckCircle className="mr-1 h-3 w-3" /> Pago
          </Badge>
        )
      case 'pending':
        return (
          <Badge className="bg-warning/10 text-warning hover:bg-warning/20">
            <AlertCircle className="mr-1 h-3 w-3" /> Pendente
          </Badge>
        )
      case 'upcoming':
        return (
          <Badge variant="outline">
            <CreditCard className="mr-1 h-3 w-3" /> A vencer
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <FinanceContext.Provider
      value={{
        payments,
        profileData,
        profileError,
        isProfileError,
        isLoadingProfileData,
        references,
        handleGenerateReference,
        handleDownloadInvoice,
        handleDownloadReference,
        getStatusBadge,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}
