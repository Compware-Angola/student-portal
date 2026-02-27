import { invoiceApi } from '@/lib/invoice-api'

interface ItemFatura {
  codigo: number
  CodigoProduto: number
  CodigoFactura: number
  Quantidade: number
  Total: number
  OBS: string
  taxa_iva: number
  valor_iva: number
  preco: number
  retencao: number
  incidencia: number
  valor_desconto: number
  descontoProduto: number
  Mes: string
  Multa: number
  mes_temp_id: number
  codigo_anoLectivo: number
  estado: number
  valor_pago: number
  valor_a_transportar: number
  DescricaoServico: string
  MesDesignacao: string
}

export interface ReferenciaPagamento {
  id: string
  PAYMENT_ID: string | null
  SOURCE_ID: string
  ENTITY_ID: string
  REFERENCE: string
  REFERENCE_ID: string
  MERCHANT_TRANSACTION_ID: string
  AMOUNT: number
  START_DATE: string // ISO string
  END_DATE: string // ISO string
  Status: 'Pending' | 'Paid' | 'Expired' | 'Cancelled'
  webhook: string
  created_at: string // ISO string
  updated_at: string | null
}

export type Invoice = {
  Codigo: number
  DataFactura: string
  TotalPreco: number
  CodigoMatricula: number
  Referencia: string
  Desconto: number
  Troco: number
  polo: string
  totalIVA: number
  TotalMulta: number
  total_incidencia: number
  total_retencao: number
  ValorAPagar: number
  ValorEntregue: number
  ValorAPagarExtenso: string
  Descricao: string
  ValorEntregueMltCX: number
  codigo_descricao: string | null
  NextFactura: string
  next: string
  texto_hash: string
  dataVencimento: string
  polo_id: string
  obs: string | null
  hashValor: string
  contaCorrente: string | null
  faturaReference: string | null
  canal: number
  ano_lectivo: number
  estado: number
  corrente: number
  codigo_preinscricao: string | null
  numSequenciaFactura: number
  tipo_documento_factura_id: number
  NomeCompleto: string
  BI_Aluno: string
  EmailAluno: string | null
  Contactos_Telefonicos: string
  Data_Nascimento: string // ISO string
  itens: ItemFatura[]
  referencias_pagamento: ReferenciaPagamento[]
}

export type InvoiceResponse = {
  data: Invoice[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type InvoiceSearchParams = {
  page?: number
  limit?: number
  status?: number
  enrollmentCode: string
  academicYear: string
}

export async function getInvoicesByMatricula(
  searchParams: InvoiceSearchParams,
): Promise<InvoiceResponse> {
  const response = await invoiceApi
    .get('invoices/by-matricula', {
      searchParams: {
        codigoMatricula: searchParams.enrollmentCode,
        academicYear: searchParams.academicYear,
        status: searchParams.status,
        page: searchParams.page,
        limit: searchParams.limit,
      },
    })
    .json<InvoiceResponse>()
  return response
}
