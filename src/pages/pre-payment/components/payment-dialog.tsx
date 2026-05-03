import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SERVICE_TYPES } from '@/constants/service-type'
import { useQueryCurrentAcademicYear } from '@/hooks/academic-year/use-query-current-academic-year'
import { useMutationCreateInvoice } from '@/hooks/invoice/use-mutation-create-invoice'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useTypeServiceSingle } from '@/hooks/service/use-query-type-service'
import type { CreateInvoiceBody } from '@/services/invoice/post-invoice.service'
import type { TypeServiceResponse } from '@/services/type-service/type-service.service'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type PaymentDialogProps = {
  isOpen: boolean
  onOpenChange?(open: boolean): void
}

export function PaymentDialog({ isOpen, onOpenChange }: PaymentDialogProps) {
  const { data: currentAcademicYear } = useQueryCurrentAcademicYear()
  const { createInvoiceAsync, createInvoicePending } = useMutationCreateInvoice()

  const { data: taxaAdmissao } = useTypeServiceSingle({
    currentYearCode: Number(currentAcademicYear?.codigo),
    ...SERVICE_TYPES.TAXA_EXAME_ADMISSAO,
  })
  const { profileData } = useQueryProfile()
  function createItem(serviceType: TypeServiceResponse | null) {
    if (!serviceType) return null
    const MAX_OBS_LENGTH = 45

    return {
      CodigoProduto: serviceType.codigo,
      Quantidade: 1,
      preco: serviceType.preco,
      Total: serviceType.preco,
      valor_pago: 0,
      obs: serviceType?.descricao?.substring(0, MAX_OBS_LENGTH) ?? '',
      taxaIva: 1,
      valorIva: 0,
      retencao: 0,
      incidencia: 0,
      valorDesconto: 0,
      descontoProduto: 0,
      mes: '',
      multa: 0,
      mesTempId: 3,
      estado: 0,
      valorPago: 0,
      valorATransportar: 0,
    }
  }

  const handleFactura = async () => {
    try {


    const totalApagar = taxaAdmissao?.preco
    const item = createItem(taxaAdmissao)
    const now = new Date()
    if (!totalApagar || !item) return

    const invoice: CreateInvoiceBody = {
      polo_id: profileData?.poloid!,
      TotalPreco: totalApagar,
      codigo_descricao: 101,
      ValorAPagar: totalApagar,
      total_incidencia: 0,
      total_retencao: 0,
      CodigoMatricula: null,
      codigo_preinscricao: profileData?.codigo_preinscricao!,
      Desconto: 0,
      totalIVA: 0,
      TotalMulta: 0,
      Descricao: 'Matrícula + Inscrição em Disciplinas'.substring(0, 44),
      tipo_documento_factura_id: 1,
      canal: 3,
      DataFactura: now.toISOString(),
      itens: [item],
    }
      await createInvoiceAsync(invoice)
      onOpenChange?.(false)
    }
    catch (error : any) {
      toast.error(error?.message ?? 'Erro ao tentar fazer pagamento')
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Pagamento</DialogTitle>
        </DialogHeader>
        <div>
          <p className="text-sm">
            Declaro que todas as informações a serem prestadas no acto de envio
            de pagamento são verdadeiros e{' '}
            <span className="font-semibold">
              comprometo-me em assumir qualquer responsabilidade juridica caso
              preste alguma informação falsa!
            </span>
          </p>

          <p className="mt-4 text-sm">
            Se concorda clique em concordo, Se não, não poderá efectuar o
            pagamento
          </p>
          <div className="flex justify-end">
            <Button onClick={() => handleFactura()}>
              {createInvoicePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Aceitar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
