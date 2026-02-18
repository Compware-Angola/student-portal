import { useQuery } from '@tanstack/react-query'
import { fetchPaymentDetailsService } from '@/services/payment/fetch-payment-details.service'

export function useQueryPaymentDetails(invoiceId?: number | string) {
  return useQuery({
    queryKey: ['payment-details', invoiceId],
    queryFn: () => {
      if (!invoiceId) throw new Error('Invoice ID is required')
      return fetchPaymentDetailsService(invoiceId)
    },
    enabled: !!invoiceId,
    staleTime: 1000 * 60 * 30,
  })
}
