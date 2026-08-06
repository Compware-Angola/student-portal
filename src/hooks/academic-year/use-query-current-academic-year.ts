import { getUsableAcademicYear } from '@/services/academic/academic-calendar.service'
import { useQuery } from '@tanstack/react-query'

export function useQueryCurrentAcademicYear(candidateType:number =1 ,enable = true) {
 return useQuery({
    queryKey: ['current-academic-year', candidateType],
   queryFn: () => getUsableAcademicYear(candidateType),
    staleTime: Infinity,
    enabled:enable,
    retry: 0,
  })


}
