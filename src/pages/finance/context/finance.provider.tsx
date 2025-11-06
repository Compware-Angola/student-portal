'use client'

import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertCircle, CreditCard } from 'lucide-react'

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
            <CreditCard className="mr-1 h-3 w-3" /> Parcelado
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <FinanceContext.Provider
      value={{
       
        profileData,
        profileError,
        isProfileError,
        isLoadingProfileData,
       
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
