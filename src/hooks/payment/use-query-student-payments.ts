import {
  fetchStudentPaymentsService,
  type FetchStudentPaymentsParams,
} from '@/services/payment/fetch-student-payments.service'
import { useQuery } from '@tanstack/react-query'

export function useQueryStudentPayments(
  params: Partial<FetchStudentPaymentsParams>,
) {
  return useQuery({
    queryKey: ['student-payments', params],
    queryFn: () => {
      if (!params.codigoPreInscricao || !params.anoLectivo) {
        throw new Error('codigoPreInscricao and anoLectivo are required')
      }
      return fetchStudentPaymentsService({
        codigoPreInscricao: params.codigoPreInscricao,
        anoLectivo: params.anoLectivo,
        codigoMatricula: params.codigoMatricula,
        page: params.page,
        limit: params.limit,
      })
    },
    enabled: Boolean(params.codigoPreInscricao && params.anoLectivo),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  })
}
