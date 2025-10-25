import z from 'zod'

export const personalDataSchema = z.object({
  fullName: z.string().min(1, 'Nome completo é obrigatório'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  issueDate: z.string().min(1, 'Data de emissão é obrigatória'),
  expirationDate: z.string().min(1, 'Data de validade é obrigatória'),
  documentType: z.string().min(1, 'Tipo de documento é obrigatório'),
  documentNumber: z.string().min(1, 'Número do documento é obrigatório'),
  gender: z.string().min(1, 'Género é obrigatório'),
  maritalStatus: z.string().min(1, 'Género é obrigatório'),
  needs: z.string().min(1, 'Género é obrigatório'),
  motherName: z.string().min(1, 'Nome da mãe é obrigatório'),
  fatherName: z.string().min(1, 'Nome da pai é obrigatório'),
})

export const PersonalDataKeys = Object.keys(
  personalDataSchema.shape,
) as (keyof typeof personalDataSchema.shape)[]
