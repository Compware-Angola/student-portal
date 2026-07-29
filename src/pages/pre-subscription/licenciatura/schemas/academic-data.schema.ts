import z from 'zod'

export const academicDataSchema = z.object({
  previousSchool: z.string().min(1, 'Escola anterior é obrigatória'),
  previousCourse: z
    .string()
    .min(1, 'Curso anterior é obrigatório')
    .regex(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
      'O curso anterior deve conter apenas letras.',
    ),
  graduationYear: z.string().min(1, 'Ano de conclusão é obrigatório'),
  typeGraduation: z.string().min(1, 'Tipo de documento é obrigatório'),
  certificate: z.union([
    z.instanceof(File, {
      message: 'Documento deve ser um ficheiro válido',
    }),
    z.literal(""),
  ]).optional(),
  averageGrade: z.coerce
    .number('Média final é obrigatória')
    .min(10, 'O valor mínimo é 10')
    .max(20, 'O valor máximo é 20'),
  // faculty: z.string().min(1, 'Faculdade é obrigatório'),
  
    
})

export const AcademicDataKeys = Object.keys(
  academicDataSchema.shape,
) as (keyof typeof academicDataSchema.shape)[]
