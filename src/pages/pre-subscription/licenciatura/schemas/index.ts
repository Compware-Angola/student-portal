import z from 'zod'
import { personalDataSchema } from './personal-data.schema'
import { academicDataSchema } from './academic-data.schema'
import { documentsSchema } from './documents.schema'
import { contactDataSchema } from './contact-data.schema'
import {
  surveyDataSchema,
  refineHowDidYouKnowOther,
} from './survey-data.schema'

export const _preSubscriptionSchema = z.object({
  ...personalDataSchema.shape,
  ...academicDataSchema.shape,
  ...documentsSchema.shape,
  ...contactDataSchema.shape,
  ...surveyDataSchema.shape,
})

export const preSubscriptionSchema = _preSubscriptionSchema
  .extend({
    averageGrade: z.string(),
  })
  .superRefine(refineHowDidYouKnowOther)

export type PreSubscriptionSchema = z.infer<typeof preSubscriptionSchema>
