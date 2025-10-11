import { formatCurrency } from '@/utils'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertCircle, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { handleGeneratePDF } from '@/utils/generate-ticket'
import type { IFinancial } from '@/services/financial.service'
import { useProfileData } from '@/hooks/use-profile-data'
import { toast } from 'sonner'

interface IPaymentItemProps {
  data: IFinancial
}

export function PaymentItem({ data }: IPaymentItemProps) {
  const { profileData, isError } = useProfileData()

  const generatePdfTicket = () => {
    if (
      isError ||
      !data ||
      !data.amountDue ||
      !data.dueDate ||
      !data.reference ||
      !data.invoiceDate ||
      !data.reference ||
      !profileData?.fullName
    ) {
      toast.error('Erro ao baixar a factura, tente novamente')
      return
    }
    const dueDate = new Date(data.dueDate).toLocaleDateString('pt-AO')
    const reference = data.reference
    const documentDate = new Date().toLocaleDateString('pt-AO')
    const value = formatCurrency(data.amountDue ?? 0)
    const documentProcessing = new Date(data.invoiceDate).toLocaleDateString('pt-AO')
    const fullName = profileData?.fullName
    const ticket = {
      cedente: 'UMA',
      entity: '11248',
      reference: reference,
      value,
      code: '20211242',
      vencimento: dueDate,
      dataDocumento: documentDate,
      dataProcessamento: documentProcessing,
      discount: '0',
      shift: 'EIN9_M1',
      course: 'Curso de Engenharia Informática',
      payer: fullName,
      instruction:
        'Quando a data de vencimento de um talão expirar, um novo talão será automaticamente gerado.\nPedimos que verifique regularmente suas datas de vencimento para garantir que os pagamentos sejam efetuados dentro do prazo e evitar atrasos.',
    }
    handleGeneratePDF(ticket)
  }

  const getStatusBadge = (status?: string) => {
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
            <CreditCard className="mr-1 h-3 w-3" />
            A vencer
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Desconhecido
          </Badge>
        )
    }
  }

  if (!data) {
    return (
      <div className="flex items-center justify-between rounded-lg border p-4">
        <p className="text-sm text-muted-foreground">
          Informação de pagamento indisponível.
        </p>
      </div>
    )
  }

  const description = data.description ?? 'Pagamento'
  const amount = formatCurrency(data.amountDue ?? 0)
  const dueDateDisplay = data.dueDate
    ? new Date(data.dueDate).toLocaleDateString('pt-AO')
    : 'Data não definida'

  return (
    <div
      key={data.id}
      className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
    >
      <div className="space-y-1">
        <p className="font-medium">{description}</p>
        <p className="text-sm text-muted-foreground">
          Vencimento: {dueDateDisplay}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-bold">{amount}</p>
          {getStatusBadge('pending')}
        </div>
        <Button size="sm" onClick={generatePdfTicket}>
          Pagar Agora
        </Button>
      </div>
    </div>
  )
}
