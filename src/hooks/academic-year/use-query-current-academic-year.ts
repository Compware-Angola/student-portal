import { getUsableAcademicYear } from '@/services/academic/academic-calendar.service'
import { useQuery } from '@tanstack/react-query'

export function useQueryCurrentAcademicYear(candidateType=1) {
 return useQuery({
    queryKey: ['current-academic-year'],
   queryFn: () => getUsableAcademicYear(candidateType),
    staleTime: Infinity,
    retry: 0,
  })


}
