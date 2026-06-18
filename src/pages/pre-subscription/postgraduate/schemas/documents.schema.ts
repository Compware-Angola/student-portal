import z from 'zod'

export const documentsSchema = z.object({


  intendedCourse: z.string('Polo é obrigatório').min(1, 'Curso é obrigatório'),
  intendedCourseSecond: z.string().optional(),
  intendedCourseThird: z.string().optional(),
  period: z.string().min(1, 'Periodo é obrigatório'),
  periodSecondOption: z.string().optional(),
  document: z.instanceof(File, {
    message: 'Documento é obrigatório',
  }),
  intendedGraduation: z.string().min(1, 'Tipo de Candidatura'),
  scientificInvestigationProject: z.instanceof(File, {
    message: 'O projeto é obrigatório',
  }),
  curriculumVitae: z.instanceof(File, {
    message: 'O currículo é obrigatório',
  }),
  certificateOrDeclaration: z.instanceof(File, {
    message: 'O certificado é obrigatório',
  }),
})
export const DocumentKeys = Object.keys(
  documentsSchema.shape,
) as (keyof typeof documentsSchema.shape)[]
