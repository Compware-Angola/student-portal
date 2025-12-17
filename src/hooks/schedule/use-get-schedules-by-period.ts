import { getSchedulesByPeriod, type GetSchedulesByPeriodParams } from '@/services/schedule/get-schedules-by-period.service'
import { useQuery } from '@tanstack/react-query'


export function useSchedulesByPeriod(params?: GetSchedulesByPeriodParams) {
  const enabled = Boolean(
    params?.anoLectivo && params?.periodo && params?.gradeCurricular,
  )

 return useQuery({
    queryKey: ['schedulesByPeriod', params],
    queryFn: () => getSchedulesByPeriod(params),
    enabled,
    staleTime: 1000 * 60 * 5,
  })


}
