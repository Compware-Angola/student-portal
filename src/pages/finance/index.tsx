'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FinanceProvider } from './context/finance.provider'
import { FinanceStats } from './componets/finance-stats'
import { PaymentList } from './componets/payment-list'
import { InvoicesTable } from './componets/invoice-table'
import { useFinance } from './hooks/use-finance'
import { toast } from 'sonner'
import { FinanceSkeleton } from './componets/finance-skeleton'

function Content() {
  const { isLoadingProfileData, isProfileError, profileError, profileData } =
    useFinance()
  if (isLoadingProfileData || isProfileError || !profileData) {
    if (profileError) {
      toast.error('Error fetching profile data')
    }
    return <FinanceSkeleton />
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finanças</h1>
        <p className="text-muted-foreground">
          Gerencie suas mensalidades e pagamentos
        </p>
      </div>

      <FinanceStats />

      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          <TabsTrigger value="invoices">Faturas</TabsTrigger>
          <TabsTrigger value="references">Referências</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="mt-6">
          <PaymentList />
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <InvoicesTable codigoMatricula={profileData.enrollmentCode} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export function Finance() {
  return (
    <FinanceProvider>
      <Content />
    </FinanceProvider>
  )
}
