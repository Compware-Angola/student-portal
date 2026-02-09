import { invoiceApi } from '@/lib/invoice-api'

export type PaymentDetail = {
  CODIGOFACTURA: number
  DATAFACTURA: string
  REFERENCIA: string
  CODIGOMATRICULA: number | null
  CODIGO_PREINSCRICAO: number | null
  VALORAPAGAR: number
  TOTALPRECO: number
  TOTALMULTA: number
  TOTALIVA: number
  OBSERVACAOFACTURA: string | null
  SERVICO: string
  QUANTIDADE: number
  PRECO: number
  VALOR_IVA: number
  MULTA: number
  TOTAL: number
  VALOR_PAGO: number
}

export async function fetchPaymentDetailsService(
  invoiceId: number | string,
): Promise<PaymentDetail[]> {
  return invoiceApi
    .get(`payment/student-payments/${invoiceId}/details`)
    .json<PaymentDetail[]>()
}
