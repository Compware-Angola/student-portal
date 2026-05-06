import {
  getInvoicesByMatricula,
  type InvoiceSearchParams,
} from '@/services/invoice/get-invoices-by-matricula.service'
import { useQuery } from '@tanstack/react-query'
interface UseQueryInvoiceParams {
  academicYear: string
  enrollmentCode?: string
  codigoPreInscricao?: string
  status?: number
  page?: number
  limit?: number
  options?: {
     enabled: boolean
   }
}

export function useQueryInvoices({
  enrollmentCode,
  academicYear,
  options,
  codigoPreInscricao,
  status,
  page = 1,
  limit = 10,
}: UseQueryInvoiceParams) {
  const isEnabled = !!academicYear && !!enrollmentCode
  const params: InvoiceSearchParams = {
    academicYear,
    enrollmentCode,
    codigoPreInscricao,
    page,
    limit,
    ...(status !== undefined && { status }),
  }
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['invoices', params],
    queryFn: () => getInvoicesByMatricula(params),
    enabled: options?.enabled ??  isEnabled,
  })

  return { data, isLoading, error, isError }
}
