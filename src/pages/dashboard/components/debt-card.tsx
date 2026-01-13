import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet } from 'lucide-react'
import { useQueryGetDebit } from '@/hooks/renegotiation/use-query-renegotiation'
import { formatCurrency } from '@/utils'
import { Skeleton } from '@/components/ui/skeleton'

type DebtCardProps = {
  enrollmentCode?: string
  preinscricao?: string
  onClick?: () => void
}

export function DebtCard(props: DebtCardProps) {
  const { enrollmentCode, preinscricao, onClick } = props
  const { data: debit, isLoading } = useQueryGetDebit({
    type: '1',
    enrollmentCode,
    preinscricao,
  })

  return (
    <Card
      className="cursor-pointer hover:bg-muted transition-colors"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Dívida Pendente</CardTitle>
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
              {formatCurrency(debit?.totalDivida ?? 0)}
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
