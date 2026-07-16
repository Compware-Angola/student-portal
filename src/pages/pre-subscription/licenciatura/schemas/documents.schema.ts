import z from 'zod'

export const documentsSchema = z.object({
  pole: z.string().min(1, 'Polo é obrigatório'),
  intendedCourse: z.string().min(1, 'Curso é obrigatório'),
  intendedCourseSecond: z.string().optional(),
  intendedCourseThird: z.string().optional(),
  period: z.string().min(1, 'Periodo é obrigatório'),
  periodSecondOption: z.string().optional(),
  document: z.instanceof(File, {
    message: 'Documento é obrigatório',
  }),
  natureInscription: z.string().min(1, 'Este campo é obrigatório'),

  publicUniversityDocument: z.any().optional(),
})
export const DocumentKeys = Object.keys(
  documentsSchema.shape,
) as (keyof typeof documentsSchema.shape)[]
