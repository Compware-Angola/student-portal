import z from 'zod'
import { personalDataSchema } from './personal-data.schema'

export const preSubscriptionSchema = z.object({
  ...personalDataSchema.shape,
})
export type PreSubscriptionSchema = z.infer<typeof preSubscriptionSchema>
