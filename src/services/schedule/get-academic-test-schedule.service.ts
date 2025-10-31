import { apexApi } from '@/lib/apex-api'
import type { AcademicTest } from '@/types/schedule'

export type AcademicTestScheduleResponse = {
  provas: AcademicTest[]
}

type AcademicTestScheduleParams = {
  academicYear: string
  semester: string
  enrollmentCode: string
}

export async function getAcademicTestSchedule(
  params: AcademicTestScheduleParams,
): Promise<AcademicTestScheduleResponse> {
  const endpoint = `schedule/academic-test/${params.academicYear}/${params.semester}/${params.enrollmentCode}`
  return apexApi.get(endpoint).json<AcademicTestScheduleResponse>()
}
