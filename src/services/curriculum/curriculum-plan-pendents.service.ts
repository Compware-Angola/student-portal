import { apexApi } from '@/lib/apex-api'
import type { CurriculumPlan } from '@/types/curriculum-plan'

export async function curriculumPlanPendentsService(
  preEnrollmentCode: string,
): Promise<CurriculumPlan> {
  return apexApi
    .get(`curriculum/curriculum-plan-pendents/${preEnrollmentCode}`)
    .json<CurriculumPlan>()
}
