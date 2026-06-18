import z from 'zod'

export const contactDataSchema = z.object({
  intendedCourse: z.string().min(1, 'Curso é obrigatório'),
  intendedCourseSecond: z.string().optional(),
  intendedCourseThird: z.string().optional(),
  period: z.string().min(1, 'Periodo é obrigatório'),
  periodSecondOption: z.string().optional(),
  email: z.email("Email é obrigatório"),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  phoneAlt: z.string().optional(),
  street: z.string().min(1, 'Morada é obrigatório'),
})
export const ContactKeys = Object.keys(
  contactDataSchema.shape,
) as (keyof typeof contactDataSchema.shape)[]
