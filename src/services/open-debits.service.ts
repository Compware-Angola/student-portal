import { api } from '@/lib/key'

type OpenDebit = {
  invoices: {
    reference: '0001'
    amount: 1500
  }[]
  totalOutstandingAmount: number
}
type params = {
  enrollmentCode: string
  academicYear: string
}
export function getOpenDebits(params: params): Promise<OpenDebit> {
  return api.get('v1/open-debts', { searchParams: params }).json<OpenDebit>()
}
