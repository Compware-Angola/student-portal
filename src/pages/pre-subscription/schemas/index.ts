import z from 'zod'
import { personalDataSchema } from './personal-data.schema'
import { academicDataSchema } from './academic-data.schema'
import { documentsSchema } from './documents.schema'

export const _preSubscriptionSchema = z.object({
  ...personalDataSchema.shape,
  ...academicDataSchema.shape,
  ...documentsSchema.shape,
})
export const preSubscriptionSchema = _preSubscriptionSchema.extend({
  averageGrade: z.number(),
})

export type PreSubscriptionSchema = z.infer<typeof preSubscriptionSchema>
