import z from 'zod'
import { personalDataSchema } from './personal-data.schema'
import { documentsSchema } from './documents.schema'
import { contactDataSchema } from './contact-data.schema'
// import { academicDataSchema } from '../../licenciatura/schemas/academic-data.schema'
// import { surveyDataSchema } from '../../licenciatura/schemas/survey-data.schema'

export const _preSubscriptionSchema = z.object({
  ...personalDataSchema.shape,
  // ...academicDataSchema.shape,
  ...documentsSchema.shape,
  ...contactDataSchema.shape,
  // ...surveyDataSchema.shape,
})
export const preSubscriptionPostGraduateSchema = _preSubscriptionSchema.extend({
  averageGrade: z.string(),
})

export type PreSubscriptionPostGraduateSchema = z.infer<
  typeof preSubscriptionPostGraduateSchema
>
