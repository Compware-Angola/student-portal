import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { login } from '@/services/auth/login.service'
import { AuthStorage } from '@/storage/auth-storage'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApi } from '@/lib/auth-api'

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
  type AuthResponse = {
    access_token: string
    expires_in: number
  }
  async function onSubmit(data: LoginFormData) {
    try {
      const response = await login(data)
      const body = { texto: data.password, hash_da_bd: response.hash }
      const authResponse = await authApi
        .post<AuthResponse>('login', { json: body })
        .json()
      AuthStorage.save({
        codigoPreinscricao: response.codigoPreinscricao,
        token: authResponse.access_token,
        user_id: response.user_id,
        user_name: response.user_name,
      })
      toast.success('Autenticado com sucesso!')

      navigate('/')
    } catch (error) {
      console.log(error)
      toast.error('Credenciais inválidas, tente novamente.')
      return
    }
  }

  return { form, onSubmit }
}
