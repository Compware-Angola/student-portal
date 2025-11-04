import { invoiceApi } from '@/lib/invoice-api'

export type InvoiceItem = {
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

export type CreateInvoiceBody = {
  DataFactura: string
  polo_id: number
  TotalPreco: number
  codigo_descricao: number
  ValorAPagar: number
  total_incidencia: number
  total_retencao: number
  CodigoMatricula: number
  codigo_preinscricao: number
  Desconto: number
  totalIVA: number
  TotalMulta: number
  Descricao: string
  tipo_documento_factura_id: number
  canal: number
  itens: InvoiceItem[]
}

export async function createInvoice(params: CreateInvoiceBody): Promise<void> {
  return invoiceApi
    .post('invoices', {
      json: params,
    })
    .json()
}