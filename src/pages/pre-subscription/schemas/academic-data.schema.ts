import z from 'zod'

export const academicDataSchema = z.object({
  previousSchool: z.string().min(1, 'Escola anterior é obrigatória'),
  graduationYear: z.string().min(1, 'Ano de conclusão é obrigatório'),
  averageGrade: z.coerce
    .number('Média final é obrigatória')
    .min(10, 'O valor mínimo é 10')
    .max(20, 'O valor máximo é 20'),
})

export const AcademicDataKeys = Object.keys(
  academicDataSchema.shape,
) as (keyof typeof academicDataSchema.shape)[]
