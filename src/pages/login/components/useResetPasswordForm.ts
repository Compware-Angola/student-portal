import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { resetPassword } from '@/services/auth/login.service'
import { z } from 'zod'

export const ResetPasswordSchema = z
  .object({
    novaSenha: z
      .string()
      .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
      .regex(/[A-Z]/, {
        message: 'A senha deve conter pelo menos uma letra maiúscula',
      })
      .regex(/[0-9]/, {
        message: 'A senha deve conter pelo menos um número',
      })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'A senha deve conter pelo menos um caractere especial',
      }),

    repetirSenha: z.string(),
  })
  .refine((data) => data.novaSenha === data.repetirSenha, {
    message: 'As senhas não coincidem',
    path: ['repetirSenha'],
  })

export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>

export function useResetPasswordForm(token?: string) {
  const navigate = useNavigate()

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      novaSenha: '',
      repetirSenha: '',
    },
  })

  async function onSubmit(data: ResetPasswordFormData) {
    if (!token) {
      navigate('/login')
      return null
    }
    try {
      await resetPassword(token, data.novaSenha)
      toast.success('Senha renovada com sucesso!')
      navigate('/login')
    } catch (error: any) {
      toast.error('Erro ao renovar senha', {
        description:
          error?.message || 'Tente solicitar um novo link de recuperação',
      })
    }
  }

  return { form, onSubmit }
}
