import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { CheckCircle, AlertCircle, CreditCard, Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { handleGeneratePDF } from '@/utils/generate-ticket'

export function Finance() {
  const payments = [
    {
      id: 1,
      month: 'Janeiro 2025',
      amount: '45.000,00 Kz',
      dueDate: '2025-01-10',
      status: 'paid',
    },
    {
      id: 2,
      month: 'Fevereiro 2025',
      amount: '45.000,00 Kz',
      dueDate: '2025-02-10',
      status: 'paid',
    },
    {
      id: 3,
      month: 'Março 2025',
      amount: '45.000,00 Kz',
      dueDate: '2025-03-10',
      status: 'pending',
    },
    {
      id: 4,
      month: 'Abril 2025',
      amount: '45.000,00 Kz',
      dueDate: '2025-04-10',
      status: 'upcoming',
    },
  ]

  const generatePdfTicket = () => {
    const boleto = {
      cedente: 'UMA',
      entity: '11248',
      reference: '100158781',
      value: '12.125,00',
      code: '20211242',
      vencimento: '08/04/2020',
      dataDocumento: '05/04/2020',
      dataProcessamento: '08/04/2020',
      discount: '100,00',
      shift: 'EIN9_M1',
      course: 'Curso de Engenharia Informática',
      payer: 'Nzinga Enoque António',
      codigoBarras: '04691796800000010000001234329000002651234567890',
      instruction:
        'Quando a data de vencimento de um talão expirar, um novo talão será automaticamente gerado.\nPedimos que verifique regularmente suas datas de vencimento para garantir que os pagamentos sejam efetuados dentro do prazo e evitar atrasos.',
    }
    handleGeneratePDF(boleto)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-success/10 text-success hover:bg-success/20">
            <CheckCircle className="mr-1 h-3 w-3" />
            Pago
          </Badge>
        )
      case 'pending':
        return (
          <Badge className="bg-warning/10 text-warning hover:bg-warning/20">
            <AlertCircle className="mr-1 h-3 w-3" />
            Pendente
          </Badge>
        )
      case 'upcoming':
        return (
          <Badge variant="outline">
            <CreditCard className="mr-1 h-3 w-3" />A vencer
          </Badge>
        )
      default:
        return null
    }
  }

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
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="space-y-1">
                  <p className="font-medium">{payment.month}</p>
                  <p className="text-sm text-muted-foreground">
                    Vencimento:{' '}
                    {new Date(payment.dueDate).toLocaleDateString('pt-AO')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold">{payment.amount}</p>
                    {getStatusBadge(payment.status)}
                  </div>
                  {payment.status === 'paid' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generatePdfTicket()}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Recibo
                    </Button>
                  )}
                  {payment.status === 'pending' && (
                    <Button size="sm">Pagar Agora</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
