import z from 'zod'

export const documentsSchema = z.object({
  typeGraduation: z.string().min(1, 'Tipo de candidatura é obrigatório'),
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
  faculty: z.number().min(1, 'Faculdade é obrigatório'),

})
export const DocumentKeys = Object.keys(
  documentsSchema.shape,
) as (keyof typeof documentsSchema.shape)[]
