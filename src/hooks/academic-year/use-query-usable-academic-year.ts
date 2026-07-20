import { getUsableAcademicYear } from "@/services/academic/academic-calendar.service"
import { useQuery } from "@tanstack/react-query"



export function useQueryUsableAcademicYear(
  candidateType: number,
) {
  return useQuery({
    queryKey: ['usable-academic-year', candidateType],
    queryFn: () => getUsableAcademicYear(candidateType),
    enabled: !!candidateType,
  })
}