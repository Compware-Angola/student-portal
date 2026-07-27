import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, CheckCircle2, XCircle, Loader2, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { useQueryFinanceMonthlyFee } from '@/hooks/finance/use-query-finance-monthly-fee'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { YearSelect } from '@/components/year-select'
import { PaymentListMonthly } from './payment-list-monthly'

type PaymentStatusFilter = 'all' | 'paid' | 'unpaid'

type PaymentListProps = {
  enrollmentCode: string
  academicYears: any[]
  selectedYear: string
  onYearChange: (year: string) => void
}

export function PaymentList({
  enrollmentCode,
  academicYears,
  selectedYear,
  onYearChange,
}: PaymentListProps) {

  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>('all')
  const limit = 12

  // AQUI ESTÁ A MÁGICA: filtro vai pro backend!
  const { data: monthlyFeeData, isLoading, isError, isFetching } = useQueryFinanceMonthlyFee({
    academicYear: Number(selectedYear),
    enrollmentCode,
    status: statusFilter,
    page,
    limit,
  })

  const payments = monthlyFeeData?.data ?? []
  const totalPages = monthlyFeeData?.totalPages ?? 1
  const currentPage = monthlyFeeData?.page ?? 1

  const handleYearChange = (year: string) => {
    onYearChange(year)
    setPage(1)
    setStatusFilter('all')
  }

  const handleStatusChange = (value: PaymentStatusFilter) => {
    setStatusFilter(value)
    setPage(1) // reseta página ao filtrar
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-2xl font-bold">Meses de Pagamento</CardTitle>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <YearSelect
              academicYears={academicYears}
              selectedYear={selectedYear}
              onChange={handleYearChange}
            />

            <Select
              value={statusFilter}
              onValueChange={(value) => handleStatusChange(value as PaymentStatusFilter)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-muted" />
                    Todas
                  </div>
                </SelectItem>
                <SelectItem value="paid">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Pagas
                  </div>
                </SelectItem>
                <SelectItem value="unpaid">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    Não pagas
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm font-medium">A carregar mensalidades...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-destructive">
            <AlertTriangle className="h-8 w-8" />
            <p className="text-sm font-medium">Erro ao carregar as mensalidades</p>
            <p className="text-xs text-muted-foreground">Tenta novamente mais tarde.</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium">Nenhuma mensalidade encontrada</p>
            <p className="text-sm mt-2">
              {statusFilter === 'all'
                ? 'Este aluno não tem mensalidades neste ano.'
                : statusFilter === 'paid'
                ? 'Não há mensalidades pagas.'
                : 'Todas as mensalidades já foram pagas.'}
            </p>
          </div>
        ) : (
          <>
            <div className={`space-y-4 transition-opacity ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
              <PaymentListMonthly payments={payments} />
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || isFetching}
                >
                  Anterior
                </Button>
                <span className="text-sm font-medium">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => p + 1)}
                  disabled={currentPage === totalPages || isFetching}
                >
                  Próxima
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}