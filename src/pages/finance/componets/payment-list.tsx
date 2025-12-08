import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Receipt, CheckCircle2, XCircle } from 'lucide-react'
import { useFinance } from '../hooks/use-finance'
import { useState, useMemo } from 'react'
import { useQueryFinanceMonthlyFee } from '@/hooks/finance/use-query-finance-monthly-fee'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { YearSelect } from '@/components/year-select'

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
  const { getStatusBadge, handleGenerateReference } = useFinance()

  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>('all')
  const limit = 12
  const { data: monthlyFeeData, isLoading, isError } = useQueryFinanceMonthlyFee({
    academicYear: selectedYear,
    enrollmentCode,
    page,
    limit,
  })

  const payments = monthlyFeeData?.data ?? []
  const totalPages = monthlyFeeData?.totalPages ?? 1

  // Filtra por pago/não pago (status_pagamento === 1 → pago)
  const filteredPayments = useMemo(() => {
    if (statusFilter === 'all') return payments

    return payments.filter((p) => {
      const isPaid = p.status_pagamento === 1 || p.status_pagamento === '1'
      return statusFilter === 'paid' ? isPaid : !isPaid
    })
  }, [payments, statusFilter])

  // Ordena por data inicial (mais antigo → mais recente)
  const sortedPayments = useMemo(() => {
    return [...filteredPayments].sort(
      (a, b) => new Date(a.data_inicial).getTime() - new Date(b.data_inicial).getTime()
    )
  }, [filteredPayments])

  const handleYearChange = (year: string) => {
    onYearChange(year)
    setPage(1)
    setStatusFilter('all')
  }

  const handleStatusChange = (value: PaymentStatusFilter) => {
    setStatusFilter(value)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Estados de loading e erro
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meses de Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="py-12 text-center text-muted-foreground">
          <div className="animate-pulse">A carregar mensalidades...</div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Erro</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            Não foi possível carregar as mensalidades.
          </p>
          <p className="text-sm mt-2">Tenta novamente mais tarde.</p>
        </CardContent>
      </Card>
    )
  }

  const hasPayments = sortedPayments.length > 0

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

            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Estado do pagamento" />
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
        {!hasPayments ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              Nenhuma mensalidade encontrada
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {statusFilter === 'all'
                ? 'Este aluno não tem mensalidades neste ano letivo.'
                : statusFilter === 'paid'
                ? 'Não há mensalidades pagas neste período.'
                : 'Todas as mensalidades já foram pagas.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedPayments.map((p) => (
              <div
                key={p.id_item}
                className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="space-y-1">
                  <h4 className="font-semibold text-lg">{p.mes}</h4>
                  <p className="text-sm text-muted-foreground">
                    Vencimento:{' '}
                    {new Date(p.data_limite).toLocaleDateString('pt-AO', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  {p.reference && (
                    <p className="text-xs font-mono text-muted-foreground">
                      Ref: <span className="font-bold text-foreground">{p.reference}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-2xl font-bold ">
                      {Number(p.total_preco).toLocaleString('pt-AO')} Kz
                    </p>
                    <div className="mt-2">
                      {getStatusBadge(
                        p.status_pagamento === 1 || p.status_pagamento === '1'
                          ? 'paid'
                          : p.status_pagamento === 2
                          ? 'upcoming'
                          : 'pending'
                      )}
                    </div>
                  </div>

                  {!p.reference && p.codigo_factura && (
                    <Button
                      onClick={() => handleGenerateReference(p.codigo_factura as number)}
                      className="min-w-44"
                    >
                      <Receipt className="mr-2 h-4 w-4" />
                      Gerar Referência
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-8 border-t">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Anterior
                </Button>

                <span className="text-sm font-medium">
                  Página <strong>{page}</strong> de <strong>{totalPages}</strong>
                </span>

                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Próximo
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}