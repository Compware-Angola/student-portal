import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authenticate } from '@/services/auth.service'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '@/error'

export const FormSchema = z.object({
  username: z.string().min(1, { message: 'Nome de usuário é obrigatório' }),
  password: z.string().min(1, { message: 'Senha é obrigatória' }),
})

export type LoginFormData = z.infer<typeof FormSchema>

export function useLoginForm() {
  const navigate = useNavigate()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginFormData) {
    try {
      const response = await authenticate(data)
      localStorage.setItem('token', response.token)
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
