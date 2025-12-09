import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FinanceProvider } from './context/finance.provider'
//import { FinanceStats } from './componets/finance-stats'

import { InvoicesTable } from './componets/invoice-table'
import { useFinance } from './hooks/use-finance'
import { toast } from 'sonner'
import { FinanceSkeleton } from './componets/finance-skeleton'

import { PaymentList } from './componets/payment-list'
import { useEffect, useState } from 'react'
import { useQueryAcademicYearStudent } from '@/hooks/academic-year/use-query-academic-year-student'

function Content() {
  const { isLoadingProfileData, isProfileError, profileError, profileData } =
    useFinance()
  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    undefined,
  )

  const { data: academicYearData, isLoading: isAcademicYearLoading } =
    useQueryAcademicYearStudent(profileData?.enrollmentCode)
  const academicYears = dedupeAcademicYears(academicYearData?.anolectivos)
  useEffect(() => {
    if (!academicYears) return

    // Encontrar o ano ativo
    const active = academicYears.find((y) => y.estado === 'Activo')

    if (active && !selectedYear) {
      setSelectedYear(String(active.codigo))
    }
  }, [academicYears, setSelectedYear])

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

  if (!academicYearData) return <FinanceSkeleton />
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finanças</h1>
        <p className="text-muted-foreground">
          Gerencie suas mensalidades e pagamentos
        </p>
      </div>

      {/* <FinanceStats /> */}
      {/*
      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
        {/* <TabsTrigger value="services">Pagamentos Pendentes</TabsTrigger>
          <TabsTrigger value="payments">Mensalidades</TabsTrigger>
          <TabsTrigger value="invoices">Nota de Pagamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="mt-6">
          <ServicesList />
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <PaymentList
            academicYear={academicYearData?.anolectivos[0].codigo }
            enrollmentCode={profileData.enrollmentCode}
            academicYears={academicYearData}
          />
        </TabsContent>
        <TabsContent value="invoices" className="mt-6">
          <InvoicesTable enrollmentCode={profileData.enrollmentCode} />
        </TabsContent>
      </Tabs>
  */}
      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
          <TabsTrigger
            value="payments"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Mensalidades
          </TabsTrigger>
          <TabsTrigger
            value="invoices"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Nota de Pagamentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="mt-6">
          <PaymentList
            enrollmentCode={profileData.enrollmentCode}
            onYearChange={setSelectedYear}
            academicYears={academicYears}
            selectedYear={selectedYear as any}
          />
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <InvoicesTable
            enrollmentCode={profileData.enrollmentCode}
            onChange={setSelectedYear}
            academicYears={academicYears}
            selectedYear={selectedYear}
          />
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
export function dedupeAcademicYears(
  list?: { codigo: string | number; designacao: string; estado: string }[],
) {
  if (!list) return []
  const map = new Map()

  list.forEach((item) => {
    map.set(item.codigo, item)
  })

  return Array.from(map.values())
}
