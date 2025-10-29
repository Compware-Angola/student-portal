import { apexApi } from '@/lib/apex-api'
import type { Schedule } from '@/types/schedule'

type ScheduleParams = {
  academicYear: string
  gradeCurricular: string
  preocidade: string
}
export async function getCurriculumSchedule(
  params: ScheduleParams,
): Promise<ScheduleResponse> {
  console.log('curriculum/curriculum-plan-schedule/1/18/586')
  const response = await apexApi
    .get(
      `curriculum/curriculum-plan-schedule/${params.preocidade}/${params.academicYear}/${params.gradeCurricular}`,
    )
    .json<ScheduleResponse>()
  return response
}

export type ScheduleResponse = {
  horarios: Schedule[]
}
