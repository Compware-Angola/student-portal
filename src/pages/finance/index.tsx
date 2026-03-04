import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FinanceProvider } from './context/finance.provider'

import { InvoicesTable } from './componets/invoice-table'
import { useFinance } from './hooks/use-finance'
import { toast } from 'sonner'
import { FinanceSkeleton } from './componets/finance-skeleton'

import { PaymentList } from './componets/payment-list'
import { useEffect, useState } from 'react'
import { useQueryAcademicYearStudent } from '@/hooks/academic-year/use-query-academic-year-student'
import { useQueryCurrentAcademicYear } from '@/hooks/academic-year/use-query-current-academic-year'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function Content() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<'payments' | 'invoices'>('payments')

  const {
    isLoadingProfileData,
    isProfileError,
    profileError,
    profileData,
  } = useFinance()

  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    undefined,
  )

  const { data: currentAcademicYear } = useQueryCurrentAcademicYear()
  const { data: academicYearData, isLoading: isAcademicYearLoading } =
    useQueryAcademicYearStudent(profileData?.enrollmentCode)


  useEffect(() => {
    const data = searchParams.get('data')
    if (!data) return

    try {
      const decoded = JSON.parse(atob(data))

      if (decoded?.tab === 'nota-pagamento') {
        setActiveTab('invoices')
      }

      if (decoded?.tab === 'mensalidades') {
        setActiveTab('payments')
      }

      navigate('/financas', { replace: true })
    } catch (error) {
      console.error('Erro ao decodificar query param')
    }
  }, [searchParams, navigate])


  if (currentAcademicYear && academicYearData?.anolectivos) {
    const currentId = Number(currentAcademicYear.codigo)

    const exists = academicYearData.anolectivos.some(
      (ano) => Number(ano.codigo) === currentId,
    )

    if (!exists) {
      academicYearData.anolectivos.push({
        codigo: String(currentId),
        designacao: currentAcademicYear.designacao,
        estado: 'Activo',
      })
    }

    academicYearData.anolectivos.sort(
      (a, b) => Number(b.codigo) - Number(a.codigo),
    )
  }

  const academicYears = dedupeAcademicYears(
    academicYearData?.anolectivos,
  )

  useEffect(() => {
    if (!academicYears) return

    const active = academicYears.find((y) => y?.estado === 'Activo')

    if (active && !selectedYear) {
      setSelectedYear(String(active.codigo))
    }
  }, [academicYears, selectedYear])


  if (
    isLoadingProfileData ||
    isProfileError ||
    !profileData ||
    isAcademicYearLoading
  ) {
    if (profileError) {
      toast.error('Erro ao buscar perfil')
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

   
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as 'payments' | 'invoices')
        }
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
          <TabsTrigger value="payments">
            Mensalidades
          </TabsTrigger>

          <TabsTrigger value="invoices">
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
