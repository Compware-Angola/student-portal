import z from 'zod'

export const documentsSchema = z.object({
  pole: z.string().min(1, 'Polo é obrigatório'),
  intendedCourse: z.string().min(1, 'Curso é obrigatório'),
  secondOption: z.string().min(1, 'Curso é obrigatório'),
})
export const DocumentKeys = Object.keys(
  documentsSchema.shape,
) as (keyof typeof documentsSchema.shape)[]
