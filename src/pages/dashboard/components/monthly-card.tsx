import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet } from 'lucide-react'
import { formatCurrency } from '@/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { useMemo } from 'react'
import { useQueryFinanceMonthlyFee } from '@/hooks/finance/use-query-finance-monthly-fee'
import { useQueryAcademicYearStudent } from '@/hooks/academic-year/use-query-academic-year-student'

type MonthlyCardProps = {
  enrollmentCode?: string
  selectedYear?: number
  onClick?: () => void
}

export function MonthlyCard({ enrollmentCode, selectedYear, onClick }: MonthlyCardProps) {
  const {
    data: monthlyFeeData,
    isLoading: isFeesLoading,
    isError: isFeesError,
  } = useQueryFinanceMonthlyFee(
    {
      academicYear: selectedYear,
      enrollmentCode,
      status: 'pending',
      page: 1,
      limit: 100,
    },
  )
  const {
    data: academicYearData,
    isLoading: isAcademicLoading,
  } = useQueryAcademicYearStudent(enrollmentCode)

  const isLoading = isFeesLoading || isAcademicLoading

  const pendingPayments = monthlyFeeData?.data ?? []

  const totalPending = useMemo(() => {
    return pendingPayments.reduce((sum, item) => sum + (item.total ?? 0), 0)
  }, [pendingPayments])
  const academicYear = academicYearData?.anolectivos?.find(
    (ano) => ano.codigo.toString() === selectedYear?.toString()
  )
  const yearLabel = academicYear?.designacao ?? selectedYear ?? 'Ano letivo'
  const hasError = isFeesError
  const hasNoData = !isLoading && pendingPayments.length === 0
  return (
    <Card
      className={`
        transition-colors
        ${onClick ? 'cursor-pointer hover:bg-muted/60 active:bg-muted' : ''}
      `}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
         Mensalidades Restantes ({yearLabel})
        </CardTitle>
        <Wallet className="h-5 w-5 text-destructive/90" />
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-2 pt-1">
            <Skeleton className="h-9 w-40 rounded-md" />
            <Skeleton className="h-4 w-48" />
          </div>
        ) : hasError ? (
          <div className="text-sm text-destructive/80">
            Erro ao carregar mensalidades
          </div>
        ) : hasNoData ? (
          <div className="space-y-1">
            <div className="text-2xl font-bold text-muted-foreground/70">
              {formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Nenhuma mensalidade pendente
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(totalPending)}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingPayments.length === 1
                ? '1 mensalidade pendente'
                : `${pendingPayments.length} Mensalidades Restantes`}
            </p>
            <p className="text-xs text-muted-foreground/80 pt-1">
              Clique para ver detalhes
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}