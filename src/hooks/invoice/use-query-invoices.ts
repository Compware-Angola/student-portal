import { getInvoicesByMatricula } from '@/services/invoice/get-invoices-by-matricula'
import { useQuery } from '@tanstack/react-query'

export function useQueryInvoices({
  codigoMatricula,
  page,
}: {
  codigoMatricula: string
  page: number
}) {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['invoices', codigoMatricula, page],
    queryFn: () => getInvoicesByMatricula({ codigoMatricula, page, limit: 3 }),
  })

  return { data, isLoading, error, isError }
}
