import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { getFinancial } from '@/services/financial.service'
import { PaymentItem } from './componets/payment-item'
import { Pagination } from '@/components/pagination'
import { useState } from 'react'

export function Finance() {
  const [currentPage, setCurrentPage] = useState(0)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['financial',currentPage],
    queryFn: () =>
      getFinancial({
        enrollmentCode: '123456',
        page: currentPage,
        size: 10,
      }),

  })

  if (isError) {
    console.error('Erro ao buscar matrículas:', error)
  }
  if (isLoading) {
    return <p>Carregando Finanças...</p>
  }

  const payments = data?.content
  const totalPages = data?.totalPages ?? 0
  const existMorePages = data?.last ?? false

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finanças</h1>
        <p className="text-muted-foreground">
          Gerencie suas mensalidades e pagamentos
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">90.000,00 Kz</div>
            <p className="text-xs text-muted-foreground">2 meses pagos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">45.000,00 Kz</div>
            <p className="text-xs text-muted-foreground">Vence em 5 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total do Ano</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">540.000,00 Kz</div>
            <p className="text-xs text-muted-foreground">12 mensalidades</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments && payments.length > 0 ? (
              <>
                {payments.map((payment) => (
                  <PaymentItem data={payment} />
                ))}
              </>
            ) : (
              <p>Nenhum Dado Encontrado</p>
            )}
          </div>
          <div className="mt-10">
            <Pagination
              last={existMorePages}
              totalPages={totalPages}
              onPageChange={(newPage) => setCurrentPage(newPage)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
