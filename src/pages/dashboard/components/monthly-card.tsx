import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { useMemo } from 'react'
import { useQueryFinanceMonthlyFee } from '@/hooks/finance/use-query-finance-monthly-fee'
import { useQueryAcademicYearStudent } from '@/hooks/academic-year/use-query-academic-year-student'
import { formatCurrency } from '@/utils'

type MonthlyCardProps = {
  enrollmentCode?: string
  selectedYear?: number
  onClick?: () => void
}

const TOTAL_MONTHS = 10

export function MonthlyCard({ enrollmentCode, selectedYear, onClick }: MonthlyCardProps) {
  const {
    data: monthlyFeeData,
    isLoading: isFeesLoading,
    isError: isFeesError,
  } = useQueryFinanceMonthlyFee({
    academicYear: selectedYear,
    enrollmentCode,
    status: 'pending',
    page: 1,
    limit: 100,
  })

  const {
    data: academicYearData,
    isLoading: isAcademicLoading,
  } = useQueryAcademicYearStudent(enrollmentCode)

  const isLoading = isFeesLoading || isAcademicLoading
  const pendingPayments = monthlyFeeData?.data ?? []
  const count = pendingPayments.length
  const paid = Math.min(TOTAL_MONTHS - count, TOTAL_MONTHS)
  const progress = Math.round((paid / TOTAL_MONTHS) * 100)

  const totalPending = useMemo(() => {
    return pendingPayments.reduce((sum, item) => sum + (item.total ?? 0), 0)
  }, [pendingPayments])

  const academicYear = academicYearData?.anolectivos?.find(
    (ano) => ano.codigo.toString() === selectedYear?.toString()
  )
  const yearLabel = academicYear?.designacao ?? selectedYear ?? 'Ano lectivo'

  return (
    <Card
      className={`transition-colors ${onClick ? 'cursor-pointer hover:bg-muted/40 active:bg-muted/60' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Mensalidades em Dívidas ({yearLabel})
        </CardTitle>
        <Wallet className="h-4 w-4 text-destructive/90" />
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-1.5 w-full rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        ) : isFeesError ? (
          <p className="text-xs text-destructive/80">Erro ao carregar mensalidades</p>
        ) : count === 0 ? (
          <>
            <div className="text-2xl font-bold text-muted-foreground/50">0</div>
            <p className="text-xs text-muted-foreground">Todas as mensalidades pagas</p>
            <Progress value={100} className="h-1.5 mt-2" />
            <p className="text-xs text-muted-foreground/60 text-right mt-1">{paid}/{TOTAL_MONTHS} pagas</p>
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{count} <span className="text-sm font-normal text-muted-foreground">{count === 1 ? 'mensalidade' : 'mensalidades'}</span></div>
            <p className="text-xs text-muted-foreground">
              {count === 1 ? 'Falta pagar 1 mensalidade neste ano lectivo' : `Faltam pagar ${count} mensalidades neste ano lectivo`}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Dando um total de{' '}
              <span className="font-bold text-destructive ">{formatCurrency(totalPending)}</span>
            </p>
            <Progress value={progress} className="h-1.5 mt-2" />
            <p className="text-xs text-muted-foreground/60 text-right mt-1">{paid}/{TOTAL_MONTHS} pagas</p>
          </>
        )}
      </CardContent>
    </Card>
  )
}