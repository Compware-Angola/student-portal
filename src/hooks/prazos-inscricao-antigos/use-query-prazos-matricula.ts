import { fetchEnrollmentAndRegistrationDeadlines } from '@/services/prazos-matriculas/get-prazos-matriculas.service'
import { useQuery } from '@tanstack/react-query'

type Params = {
  anoLectivo?: number 
  codigoTipoCandidatura?: number
  isNewStudent?: number
  
}

export function UseQueryEnrollmentAndRegistrationDeadlines(params: Params) {
  return useQuery({
    queryKey: ['enrollment-and-registration-deadlines', params.anoLectivo, params.codigoTipoCandidatura, params.isNewStudent],
    queryFn: () => fetchEnrollmentAndRegistrationDeadlines({
      anoLectivo: params.anoLectivo!,
      codigoTipoCandidatura: params.codigoTipoCandidatura,
      isNewStudent: params.isNewStudent
    }),
    enabled: !!params.anoLectivo && !!params.codigoTipoCandidatura
  })
}
