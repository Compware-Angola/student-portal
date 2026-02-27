import { apexApi } from '@/lib/apex-api'
import type { CurriculumPlan } from '@/types/curriculum-plan'

type CurriculumPlanPendentProps = {
  preEnrollmentCode: string,
  semestre? : number
}
export async function curriculumPlanPendentsService(
  {preEnrollmentCode,semestre }: CurriculumPlanPendentProps

): Promise<CurriculumPlan> {
  return apexApi
    .get(`curriculum/curriculum-plan-pendents/${preEnrollmentCode}`, {
      searchParams: {
        semestre
      }
    })
    .json<CurriculumPlan>()
}
