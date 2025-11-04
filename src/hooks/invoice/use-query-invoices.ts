import { getInvoicesByMatricula, type InvoiceSearchParams } from '@/services/invoice/get-invoices-by-matricula.service'
import { useQuery } from '@tanstack/react-query'
interface UseQueryInvoiceParams {
  academicYear?: string
  enrollmentCode?: string
  // Adicione parâmetros de paginação se for usá-los no futuro (padrão é 1 e 10)
  page?: number 
  limit?: number
}
 

export function useQueryInvoices({
  enrollmentCode,
  academicYear,
  page = 1, // Definindo valor padrão aqui
  limit = 10, // Definindo valor padrão aqui
}: UseQueryInvoiceParams) {
    // O Type Guard garante que só buscaremos se tivermos o mínimo necessário.
    const isEnabled = !!academicYear && !!enrollmentCode
    // 1. Constrói o objeto de parâmetros que será passado para getmonthlyFee
    const params: InvoiceSearchParams = {
      academicYear: academicYear as string, // Cast seguro devido ao isEnabled
      enrollmentCode: enrollmentCode as string, // Cast seguro devido ao isEnabled
      page,
      limit,
    }
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['invoices', params],
    queryFn: () => getInvoicesByMatricula(params),
    enabled: isEnabled
  })

  return { data, isLoading, error, isError }
}
