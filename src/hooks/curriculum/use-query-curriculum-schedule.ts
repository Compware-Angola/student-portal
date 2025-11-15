import {
  getCurriculumSchedule,
  type ScheduleResponse,
} from '@/services/curriculum/get-shedule.ts.service'

import { useQuery } from '@tanstack/react-query'
type Params = {
  academicYear?: string
  gradeCurricular?: string
  preocidade?: string
}
export function useQueryCurriculumSchedule(params: Params, enabled: boolean) {
  const { data, isLoading, error, isError, refetch } =
    useQuery<ScheduleResponse>({
      queryKey: [
        'schedule',
        params.academicYear,
        params.gradeCurricular,
        params.preocidade,
      ],
      queryFn: async () => {
        if (
          !params.academicYear ||
          !params.gradeCurricular ||
          !params.preocidade
        ) {
          throw new Error('Missing required parameters')
        }
        return getCurriculumSchedule({
          academicYear: params.academicYear!,
          gradeCurricular: params.gradeCurricular!,
          preocidade: params.preocidade!,
        })
      },
      retry: 0,
      enabled:
        !!params.academicYear &&
        !!params.gradeCurricular &&
        !!params.preocidade &&
        enabled,
      staleTime: Infinity,
    })

  return {
    data: data?.horarios ?? [],
    isLoading,
    error,
    isError,
    refetch,
  }
}
