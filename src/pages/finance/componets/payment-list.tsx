import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Receipt, CheckCircle2, XCircle } from 'lucide-react'
import { useFinance } from '../hooks/use-finance'
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
import { formatCurrency } from '@/utils'

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

  // AQUI ESTÁ A MÁGICA: filtro vai pro backend!
  const { data: monthlyFeeData, isLoading, isError } = useQueryFinanceMonthlyFee({
    academicYear: selectedYear,
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Meses de Pagamento</CardTitle></CardHeader>
        <CardContent className="py-12 text-center">
          <div className="animate-pulse text-muted-foreground">A carregar...</div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-destructive">Erro</CardTitle></CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          Não foi possível carregar as mensalidades.
        </CardContent>
      </Card>
    )
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

            <Select value={statusFilter} onValueChange={handleStatusChange}>
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
                <SelectItem value="pending">
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
        {payments.length === 0 ? (
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
            <div className="space-y-4">
              {payments.map((p) => (
                <div
                  key={p.id_item}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{p.mes}</h3>
                    <p className="text-sm text-muted-foreground">
                      Vencimento: {new Date(p.data_limite).toLocaleDateString('pt-AO')}
                    </p>
                    {p.reference && (
                      <p className="text-xs font-mono">
                        Ref: <strong>{p.reference}</strong>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-1xl font-bold ">
                        {formatCurrency(Number(p.status_pagamento === 1 ? p.valor_pago : p.total_preco))}
                      </p>
                      <div className="mt-3">
                        {getStatusBadge(
                          p.status_pagamento === 1 ? 'paid' : 
                          p.status_pagamento === 2 ? 'upcoming' : 'pending'
                        )}
                      </div>
                    </div>

                    {!p.reference && p.codigo_factura && (
                      <Button
                        onClick={() => handleGenerateReference(p.codigo_factura as number)}
                        size="lg"
                      >
                        <Receipt className="mr-2 h-4 w-4" />
                        Gerar Referência
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="text-sm font-medium">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => p + 1)}
                  disabled={currentPage === totalPages}
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