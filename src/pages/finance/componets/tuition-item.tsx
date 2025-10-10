import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { handleGeneratePDF } from '@/utils/generate-ticket'
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Receipt,
} from 'lucide-react'

type Props = {
  month: string
  amount: number
  dueDate: string
  status: 'paid' | 'pending' | 'overdue'
  reference: string
}

export const TuitionItem = ({
  month,
  amount,
  dueDate,
  status,

}: Props) => {
  const statusConfig = {
    paid: {
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
      icon: CheckCircle2,
      label: 'Pago',
    },
    pending: {
      color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      icon: Clock,
      label: 'Pendente',
    },
    overdue: {
      color: 'bg-red-500/20 text-red-400 border-red-500/50',
      icon: AlertCircle,
      label: 'Vencido',
    },
  }

  const config = statusConfig[status]
  const StatusIcon = config.icon
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
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-accent  border border-transparent hover:border-emerald-500/50 transition-all">
      <div className="flex-shrink-0 items ">
        <div
          className={`w-12 h-12 rounded-full ${config.color} flex items-center justify-center border`}
        >
          <StatusIcon className="w-6 h-6" />
        </div>
      </div>
      <div className="flex-1 min-w-0 items-center">
        <div className="flex items-center justify-between mb-1">
          <h4 className="flex  font-semibold">{month}</h4>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Vencimento: {dueDate}
          </span>
        </div>
        <p className="font-bold mt-2">AOA {amount.toLocaleString()}</p>
      </div>
      <div className="flex  gap-2 flex-shrink-0">
        <Badge className={config.color}>{config.label}</Badge>
        {status === 'paid' && (
          <Button size="sm" variant="outline" className="border-slate-600">
            <Receipt className="w-4 h-4 mr-1" />
            Recibo
          </Button>
        )}
        {status === 'pending' && (
          <Button
            onClick={() => generatePdfTicket()}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <CreditCard className="w-4 h-4 mr-1" />
            Pagar
          </Button>
        )}
        {status === 'overdue' && (
          <Button size="sm" className="bg-red-600 hover:bg-red-700">
            <AlertCircle className="w-4 h-4 mr-1" />
            Regularizar
          </Button>
        )}
      </div>
    </div>
  )
}
