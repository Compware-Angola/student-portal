import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '@/error'

export const FormSchema = z.object({
  documentType: z
    .string()
    .min(1, { message: 'Tipo de documento é obrigatório' }),
  documentNumber: z
    .string()
    .min(1, { message: 'Número de documento é obrigatório' }),
  registerType: z
    .string()
    .min(1, { message: 'Tipo de candidatura é obrigatório' }),
  fullname: z.string().min(1, { message: 'Nome de usuário é obrigatório' }),
  phone: z.string().min(1, { message: 'Telefone é obrigatório' }),
  email: z.email({ message: 'Email inválido' }).optional(),
  password: z.string().min(1, { message: 'Senha é obrigatória' }),
})

export type RegisterFormData = z.infer<typeof FormSchema>

export function useRegisterForm() {
  const navigate = useNavigate()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      documentNumber: '',
      registerType: '',
      fullname: '',
      phone: '',
      email: '',
      password: '',
      documentType: '',
    },
  })

  async function onSubmit(data: RegisterFormData) {
    console.log(data)
    try {
      //  const response = await authenticate(data)
      //  localStorage.setItem('token', response.token)
      toast.success('Autenticado com sucesso!')
      navigate('/')
    } catch (error) {
      if (error instanceof ApiError) {
        switch (error.status) {
          case 400:
            toast.error('Dados inválidos, verifique os campos.')
            break
          case 401:
            toast.error('Credenciais inválidas, tente novamente.')
            break
          case 500:
            toast.error('Erro no servidor. Tente mais tarde.')
            break
          default:
            toast.error('Erro desconhecido contacte suporte.')
        }
        return
      }
      toast.error('Erro desconhecido contacte suporte.')
    }
  }

  return { form, onSubmit }
}
