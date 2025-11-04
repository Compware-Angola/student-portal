import { invoiceApi } from '@/lib/invoice-api'

export type PaymentReferenceNotify = {
  name: string
  telephone: string
  email: string
  smsNotification: boolean
  emailNotification: boolean
}

export type PaymentReferenceEnrollment = {
  CodigoMatricula: number
  codigo_preinscricao: number
}

export type PaymentReferenceItem = {
  CodigoProduto: number
  Quantidade: number
  preco: number
  Total: number
  valor_pago: number
  obs: string
  taxaIva: number
  valorIva: number
  retencao: number
  incidencia: number
  valorDesconto: number
  descontoProduto: number
  mes: string
  multa: number
  mesTempId: number
  estado: number
  valorPago: number
  valorATransportar: number
  codigoFactura: number
}

export type CreatePaymentReferenceBody = {
  amount: number
  currency: string
  description: string
  enrollment: PaymentReferenceEnrollment
  itens: PaymentReferenceItem[]
}

/**
 * Cria uma referência de pagamento para mensalidades.
 * Endpoint: /api/payment-references/all/mensalidades
 */
export async function createPaymentReferenceMensalidades(
  params: CreatePaymentReferenceBody,
): Promise<void> {
  return invoiceApi
    .post('payment-references/all/mensalidades', {
      json: params,
    })
    .json()
}
