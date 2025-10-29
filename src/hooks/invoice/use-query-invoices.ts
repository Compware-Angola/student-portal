import { getInvoicesByMatricula } from '@/services/invoice/get-invoices-by-matricula.service'
import { useQuery } from '@tanstack/react-query'

export function useQueryInvoices({
  enrollmentCode,
  page,
}: {
  enrollmentCode: string
  page?: number
}) {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['invoices', enrollmentCode, page],
    queryFn: () => getInvoicesByMatricula({ enrollmentCode, page }),
    enabled: !!enrollmentCode,
  })

  return { data, isLoading, error, isError }
}
