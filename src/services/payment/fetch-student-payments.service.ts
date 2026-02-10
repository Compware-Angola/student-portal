import { invoiceApi } from '@/lib/invoice-api'

export type StudentPayment = {
  CodigoFactura: number
  DATAFACTURA: string
  VALORAPAGAR: number
  TOTALPRECO: number
  TOTALMULTA: number
  EstadoFactura: number
}

export type FetchStudentPaymentsResponse = {
  data: StudentPayment[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type FetchStudentPaymentsParams = {
  codigoMatricula?: number | string
  codigoPreInscricao: number | string
  anoLectivo: number | string
  page?: number
  limit?: number
}

export async function fetchStudentPaymentsService({
  codigoMatricula,
  codigoPreInscricao,
  anoLectivo,
  page = 1,
  limit = 10,
}: FetchStudentPaymentsParams): Promise<FetchStudentPaymentsResponse> {
  return invoiceApi
    .get('payment/student-payments', {
      searchParams: {
        codigoMatricula: String(codigoMatricula),
        codigoPreInscricao: String(codigoPreInscricao),
        anoLectivo: String(anoLectivo),
        page: String(page),
        limit: String(limit),
      },
    })
    .json<FetchStudentPaymentsResponse>()
}
