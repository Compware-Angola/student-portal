import { apexApi } from '@/lib/apex-api'
import type { CurriculumPlan } from '@/types/curriculum-plan'

type Params = {
  class: number
  course: number
  semestre?: number
}

export async function curriculumPlanService(
  params: Params,
): Promise<CurriculumPlan> {
  return apexApi
    .get(`curriculum/curriculum-plan/student/${params.class}/${params.course}`, {
      searchParams: {
        semestre: params.semestre
      }
    })
    .json<CurriculumPlan>()
}
