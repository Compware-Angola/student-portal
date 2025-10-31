import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Receipt } from 'lucide-react'
import { useFinance } from '../hooks/use-finance'
import { useQueryFinanceMonthlyFee } from '@/hooks/finance/use-query-finance-monthly-fee'

export function PaymentList({ academicYear, enrollmentCode }: { academicYear: string, enrollmentCode: string }) {
  const { getStatusBadge, handleGenerateReference } = useFinance()

  const {
    data: monthlyFeeData,
    isLoading,
    isError,
  } = useQueryFinanceMonthlyFee({ academicYear, enrollmentCode })

  const payments = monthlyFeeData?.mensalidades ?? []
  const getPaymentStatus = (status: number): 'paid' | 'pending' | 'upcoming' => {
    return status === 1 ? 'paid' : 'pending'
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meses de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>A carregar meses de pagamento...</CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro</CardTitle>
        </CardHeader>
        <CardContent>
          Não foi possível carregar os dados de pagamento.
        </CardContent>
      </Card>
    )
  }

  if (payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meses de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>Nenhuma mensalidade encontrada no momento.</CardContent>
      </Card>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meses de Pagamento </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {payments.map((p) => (
          <div

            key={p.id_item}
            className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <div>

              <p className="font-medium">{p.mes}</p>
              <p className="text-sm text-muted-foreground">

                Vencimento: {new Date(p.data_limite).toLocaleDateString('pt-AO')}
              </p>

              {p.reference && (
                <p className="text-xs text-muted-foreground">
                  Referência: {p.reference}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right space-y-2">

                <p className="font-bold">{p.total_item} Kz</p>

                {getStatusBadge(getPaymentStatus(p.status_pagamento))}
              </div>

              {/* O botão 'Gerar Referência' só aparece se:
                  1. A referência ainda não foi gerada (p.reference é null/falso)
                  2. O status é 'pending' (não pago, status_pagamento !== 1) */}
              {(p.status_pagamento !== 1 && !p.reference) ||
                (p.status_pagamento !== 1 && new Date(p.data_vencimento) < new Date()) ? (
                <Button
                  variant="outline"
                  size="sm"
                  // Use 'p.id_item' ou 'p.codigo_factura' (conforme sua função espera)
                  onClick={() => handleGenerateReference(p.codigo_factura)}
                >
                  <Receipt className="mr-2 h-4 w-4" /> Gerar Referência
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}