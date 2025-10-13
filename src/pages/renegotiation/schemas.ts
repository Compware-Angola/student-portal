import * as z from 'zod'

// Schemas
export const searchDebtSchema = z.object({
  enrollmentCode: z.string().min(1, 'Código de matrícula é obrigatório'),
  academicYear: z.string().min(1, 'Ano académico é obrigatório'),
})
