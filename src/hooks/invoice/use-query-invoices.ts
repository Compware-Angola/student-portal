import {
  getInvoicesByMatricula,
  type InvoiceSearchParams,
} from '@/services/invoice/get-invoices-by-matricula.service'
import { useQuery } from '@tanstack/react-query'
interface UseQueryInvoiceParams {
  academicYear: string
  enrollmentCode: string
  status?: number
  page?: number
  limit?: number
}

export function useQueryInvoices({
  enrollmentCode,
  academicYear,
  status,
  page = 1, // Definindo valor padrão aqui
  limit = 10, // Definindo valor padrão aqui
}: UseQueryInvoiceParams) {
  // O Type Guard garante que só buscaremos se tivermos o mínimo necessário.
  const isEnabled = !!academicYear && !!enrollmentCode
  // 1. Constrói o objeto de parâmetros que será passado para getmonthlyFee
  const params: InvoiceSearchParams = {
    academicYear,
    enrollmentCode,
    page,
    limit,
    ...(status !== undefined && { status }), // status será number | undefined → aceito!
  }
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['invoices', params],
    queryFn: () => getInvoicesByMatricula(params),
    enabled: isEnabled,
  })

  return { data, isLoading, error, isError }
}
