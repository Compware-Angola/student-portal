import { api } from '@/lib/key'

export type IFinancial = {
  id: string
  code: number
  invoiceDate: string
  totalPrice: number
  enrollmentCode: string
  reference: string
  discount: number
  change: number
  vatTotal: number
  fineTotal: number
  taxableBase: number
  withholdingTotal: number
  amountDue: number
  amountPaid: number
  amountDueInWords: string
  description: string
  amountPaidMultiple: number
  descriptionCode: string
  nextInvoice: string
  next: string
  hashText: string
  dueDate: string
  branchId: number
  notes: string
  hashValue: string
  currentAccount: string
  invoiceReference: string
  channel: number
  academicYear: string
  academicYearCode: string
  status: number
  current: number
  preEnrollmentCode: number
  invoiceSequenceNumber: number
  invoiceDocumentTypeId: number
}

export type IFinancialResponse = {
  content: IFinancial[]
  number: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

export type IGetFinancialProps = {
  enrollmentCode: string
  page: number
  size: number
}
export async function getFinancial(data: IGetFinancialProps) {
  const { enrollmentCode, page, size } = data
  return await api
    .get(
      `v1/financial/invoices?enrollmentCode=${enrollmentCode}&page=${page}&size=${size}`,
    )
    .json<IFinancialResponse>()
}

export async function generateReference(enrollmentCode: string, data: any) {
  return await api
    .post(`v1/financial/generate-reference/${enrollmentCode}`, {
      json: data,
      timeout: 180000,
    })
    .json<any>()
}
