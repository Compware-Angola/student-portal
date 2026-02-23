import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'

import {
  CreditCard,
  AlertCircle,
  CheckCircle,
  FileText,
  Receipt,
  ChevronDown,
  ChevronUp,
  Calendar,
  Wallet,
  Tag,
  Info,
  Banknote,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import type { Mensalidade } from '@/types/finance-api-response'
import { transformMonthly } from '@/utils/transform-Monthly'

export interface Monthly {
  id: number
  month: string
  description: string
  valorBase: string
  mensalidade: string
  desconto: string
  tipoDesconto: string
  valorPago: string
  valorAPagar: string
  multa: string | null
  formaPagamento: string | null
  dataPagamento: string | null
  dueDate: string | null
  status: number
  reference: string | null
  observacoes: string | null
  bolseiro: number
}
interface PaymentMonthly {
  payments: Mensalidade[]
}
const PaymentListMonthly = ({ payments }: PaymentMonthly) => {
  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return (
          <Badge className="bg-success/10 text-success hover:bg-success/20">
            <CheckCircle className="mr-1 h-3 w-3" />
            Pago
          </Badge>
        )
      case 2:
        return (
          <Badge className="bg-warning/10 text-warning hover:bg-warning/20">
            <AlertCircle className="mr-1 h-3 w-3" />
            Pendente
          </Badge>
        )
      case 0:
        return (
          <Badge className="bg-warning/10 text-warning hover:bg-warning/20">
            <AlertCircle className="mr-1 h-3 w-3" />
            Pendente
          </Badge>
        )
      default:
        return null
    }
  }
  const [expandedPayment, setExpandedPayment] = useState<number | null>(null)
  const monthlys = useMemo(() => transformMonthly(payments), [payments])
  return (
    <>
      <div className="space-y-4">
        {monthlys.map((payment) => (
          <div
            key={payment.id}
            className="rounded-lg border transition-colors overflow-hidden"
          >
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
              onClick={() =>
                setExpandedPayment(
                  expandedPayment === payment.id ? null : payment.id,
                )
              }
            >
              <div className="space-y-1">
                <p className="font-medium">{payment.month}</p>
                <p className="text-sm text-muted-foreground">
                  {payment.description}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right space-y-2">
                  <p className="font-bold">{payment.valorBase}</p>
                  {getStatusBadge(payment.status)}
                </div>
                {expandedPayment === payment.id ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>

            {expandedPayment === payment.id && (
              <div className="border-t bg-muted/30 p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-start gap-2">
                    <Banknote className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Mensalidade
                      </p>
                      <p className="text-sm font-medium">{payment.mensalidade}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Tag className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Desconto</p>
                      <p className="text-sm font-medium text-success">
                        {payment.desconto}
                      </p>
                      {payment.tipoDesconto && (
                        <p className="text-xs text-muted-foreground">
                          {payment.tipoDesconto}
                        </p>
                      )}
                    </div>
                  </div>
                  {payment.multa && (
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 mt-0.5 text-destructive" />
                      <div>
                        <p className="text-xs text-muted-foreground">Multa</p>
                        <p className="text-sm font-medium text-destructive">
                          {payment.multa}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <Wallet className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Valor Pago
                      </p>
                      <p className="text-sm font-medium">{payment.valorPago}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CreditCard className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Valor a Pagar
                      </p>
                      <p className="text-sm font-bold">{payment.valorAPagar}</p>
                    </div>
                  </div>
                  {payment.dueDate && (
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Vencimento
                        </p>
                        <p className="text-sm font-medium">
                          {new Date(payment.dueDate).toLocaleDateString(
                            'pt-AO',
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {payment.formaPagamento && (
                    <div className="flex items-start gap-2">
                      <Receipt className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Forma de Pagamento
                        </p>
                        <p className="text-sm font-medium">
                          {payment.formaPagamento}
                        </p>
                      </div>
                    </div>
                  )}
                  {payment.dataPagamento && (
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 text-success" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Data de Pagamento
                        </p>
                        <p className="text-sm font-medium">
                          {new Date(payment.dataPagamento).toLocaleDateString(
                            'pt-AO',
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  {payment.reference && (
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Referência
                        </p>
                        <p className="text-sm font-medium">
                          {payment.reference}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {payment.observacoes && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Observações
                        </p>
                        <p className="text-sm">{payment.observacoes}</p>
                      </div>
                    </div>
                  </>
                )}
                {/* {!payment.reference && payment.status == 0 && (
                  <>
                    <Separator />
                    <Button variant="outline" size="sm" onClick={() => {}}>
                      <Receipt className="mr-2 h-4 w-4" />
                      Gerar Referência
                    </Button>
                  </>
                )} */}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
export { PaymentListMonthly }
