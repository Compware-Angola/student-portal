import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet } from 'lucide-react'
import { formatCurrency } from '@/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { useQueryFinanceMonthlyFee } from '@/hooks/finance/use-query-finance-monthly-fee'
import { useMemo } from 'react'
import { useQueryAcademicYearStudent } from '@/hooks/academic-year/use-query-academic-year-student'

type MonthlyCardProps = {
  enrollmentCode?: string
  selectedYear?: string
  onClick?: () => void
}

export function MonthlyCard(props: MonthlyCardProps) {
  const { enrollmentCode, selectedYear, onClick } = props

  const {
    data: monthlyFeeData,
    isLoading,
    isError,
  } = useQueryFinanceMonthlyFee({
    academicYear: selectedYear,
    enrollmentCode,
    status: 'pending',
    page: 1,
    limit: 100,
  })
  const { data: academicYearData, isLoading: isAcademicYearLoading } =
    useQueryAcademicYearStudent(enrollmentCode)
  academicYearData?.anolectivos[0].codigo == selectedYear
  const payments = monthlyFeeData?.data ?? []
  const sumPendents = useMemo(() => {
    return payments.reduce((acc, payment) => {
      return acc + (payment.total ?? 0)
    }, 0)
  }, [payments])

  const academicDescricption = academicYearData?.anolectivos.find(
    (ano) => ano.codigo === selectedYear,
  )

  const description = academicDescricption?.designacao ?? ''
  return (
    <Card
      className="cursor-pointer hover:bg-muted transition-colors"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">
            Mensalidades Pendentes ({description})
          </CardTitle>

        </div>
        <Wallet className="h-4 w-4 text-destructive" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(sumPendents ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Clique para ver detalhes
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
