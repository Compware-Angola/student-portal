'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FinanceProvider } from './context/finance.provider'
import { FinanceStats } from './componets/finance-stats'
import { PaymentList } from './componets/payment-list'
import { InvoicesTable } from './componets/invoice-table'
import { useFinance } from './hooks/use-finance'
import { toast } from 'sonner'
import { FinanceSkeleton } from './componets/finance-skeleton'
import { ServicesList } from './componets/services-list'
import { useQueryAcademicYear } from '@/hooks/academic-year/use-query-academic-year'

function Content() {
  const { isLoading: isAcademicYearLoading, data: academicYearData } =
    useQueryAcademicYear()
  const { isLoadingProfileData, isProfileError, profileError, profileData } =
    useFinance()
  if (
    isLoadingProfileData ||
    isProfileError ||
    !profileData ||
    isAcademicYearLoading
  ) {
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

      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
         <TabsTrigger value="services">Pagamentos Pendentes</TabsTrigger>
          <TabsTrigger value="payments">Mensalidades</TabsTrigger>
          <TabsTrigger value="invoices">Nota de Pagamentos</TabsTrigger>
        </TabsList>
        <TabsContent value="services" className="mt-6">
          <ServicesList />
        </TabsContent>
        <TabsContent value="payments" className="mt-6">
          <PaymentList
            academicYear={academicYearData?.anolectivos[0].codigo ?? '22'}
            enrollmentCode={profileData.enrollmentCode}
          />
        </TabsContent>
        <TabsContent value="invoices" className="mt-6">
          <InvoicesTable enrollmentCode={profileData.enrollmentCode} />
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
