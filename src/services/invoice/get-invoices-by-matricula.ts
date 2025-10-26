import { invoiceApi } from '@/lib/invoice-api'

export type Invoice = {
  Codigo: number
  DataFactura: string
  TotalPreco: number
  CodigoMatricula: number
  Referencia: string
  ValorAPagar: number
  ValorEntregue: number
  ValorAPagarExtenso: string
}

export type InvoiceResponse = {
  data: Invoice[]
  total: number
  page: number
  limit: number
  totalPages: number
}

type InvoiceSearchParams = {
  page: number
  limit: number
  codigoMatricula: string
}

export async function getInvoicesByMatricula(
  searchParams: InvoiceSearchParams,
): Promise<InvoiceResponse> {
  const response = await invoiceApi
    .get('by-matricula', { searchParams })
    .json<InvoiceResponse>()
  return response
}
