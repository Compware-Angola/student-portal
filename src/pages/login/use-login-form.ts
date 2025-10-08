import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authenticate } from '@/services/auth.service'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
export const FormSchema = z.object({
  username: z.string().min(1, {
    message: 'Nome de usuário é obrigatório',
  }),
  password: z.string().min(1, {
    message: 'Senha é obrigatória',
  }),
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
      const token = response.token
      localStorage.setItem('token', token)
      toast.success('Autenticado com sucesso!')
      navigate('/')
    } catch (error) {
      toast.error(
        'Credenciais inválidas. Verifique suas credenciais e tente novamente.',
      )
    }
  }

  return { form, onSubmit }
}
