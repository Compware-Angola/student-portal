import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { useUpdateStudentPassword } from '@/hooks/student/use-query-mutation-update-password'
import { z } from 'zod'

export const SecurityFormSchema = z
  .object({
    newPassword: z
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

    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type SecurityFormData = z.infer<typeof SecurityFormSchema>

export function useSecurityForm(userId: string) {
  const { mutateAsync } = useUpdateStudentPassword(userId)

  const form = useForm<SecurityFormData>({
    resolver: zodResolver(SecurityFormSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: SecurityFormData) {
    try {
      await mutateAsync(data)
      form.reset()
    } catch {
      toast.error('Erro ao atualizar senha')
    }
  }

  return { form, onSubmit }
}
