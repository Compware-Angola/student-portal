import z from 'zod'

export const academicDataSchema = z.object({
  previousSchool: z.string().min(1, 'Escola anterior é obrigatória'),
  graduationYear: z.string().min(1, 'Ano de conclusão é obrigatório'),
  averageGrade: z.string().min(1, 'Média final é obrigatória'),
})
