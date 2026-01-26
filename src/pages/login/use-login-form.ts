import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { login } from '@/services/auth/login.service'
import { AuthStorage } from '@/storage/auth-storage'
import { zodResolver } from '@hookform/resolvers/zod'
import { useStudentSituation } from '@/hooks/use-student-stitiation'

export const FormSchema = z.object({
  username: z.string().min(1, { message: 'Nome de usuário é obrigatório' }),
  password: z.string().min(1, { message: 'Senha é obrigatória' }),
})

export type LoginFormData = z.infer<typeof FormSchema>

export function useLoginForm() {
  const { setPreEnrollmentCode } = useStudentSituation()
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
        const credentials = {
      ...data,
      platform: 'PORTAL', 
    }

      const response = await login(credentials)
     
  
      AuthStorage.save({
        codigoPreinscricao: response.user.codigopreinscricao,
        token: response.access_token,
        user_id: response.user.id,
        user_name: response.user.nomecompleto,
      })
      setPreEnrollmentCode(response.user.codigopreinscricao)
      toast.success( response.mensagem ||'Autenticado com sucesso!')

      navigate('/')
    } catch (error) {
      console.log(error)
      toast.error('Credenciais inválidas, tente novamente.')
      return
    }
  }

  return { form, onSubmit }
}
