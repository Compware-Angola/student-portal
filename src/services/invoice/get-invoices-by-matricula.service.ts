import { invoiceApi } from '@/lib/invoice-api'

export type Invoice = {
  Codigo: number
  DataFactura: string
  TotalPreco: number
  CodigoMatricula: number
  Referencia: string
  Descricao: string
  NextFactura: string
  dataVencimento: string
  Desconto: number
  TotalMulta: number
  totalIVA: number
  totalIncidencia: number
  totalRetencao: number
  ValorAPagar: number
  ValorAPagarExtenso: string
  anoLectivo: number
  tipoDocumentoFacturaId: number
  poloId: string
  estado: number
}

export type InvoiceResponse = {
  data: Invoice[]
  total: number
  page: number
  limit: number
  totalPages: number
}

type InvoiceSearchParams = {
  page?: number
  limit?: number
  enrollmentCode: string
}

export async function getInvoicesByMatricula(
  searchParams: InvoiceSearchParams,
): Promise<InvoiceResponse> {
  console.log('getInvoicesByMatricula', searchParams)
  const response = await invoiceApi
    .get('by-matricula', {
      searchParams: {
        codigoMatricula: searchParams.enrollmentCode,
        page: searchParams.page,
        limit: searchParams.limit,
      },
    })
    .json<InvoiceResponse>()
  return response
}
