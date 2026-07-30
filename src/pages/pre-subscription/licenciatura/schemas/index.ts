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
     averageGrade: z.coerce
        .number({ message: 'Média final é obrigatória' })
        .min(10, 'O valor mínimo é 10')
        .max(20, 'O valor máximo é 20'),
    
  })
  .superRefine(refineHowDidYouKnowOther)

export type PreSubscriptionSchema = z.input<typeof preSubscriptionSchema>
export type PreSubscriptionSchemaOutput = z.output<typeof preSubscriptionSchema>