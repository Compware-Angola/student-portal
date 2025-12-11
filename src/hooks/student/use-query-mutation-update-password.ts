import {
  updateStudentPassword,
  type UpdatePasswordParams,
} from '@/services/students/resete-password.service'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'

import { toast } from 'sonner'

export function useUpdateStudentPassword(
  userId: string,
): UseMutationResult<{ message: string }, Error, UpdatePasswordParams> {
  return useMutation({
    mutationFn: (params: UpdatePasswordParams) => {
      if (!userId) throw new Error('UserId é obrigatório')
      return updateStudentPassword(userId, params)
    },
    onSuccess: (data) => {
      toast.success('Sucesso', {
        description: data.message || 'Senha atualizada com sucesso!',
      })
    },
    onError: (error) => {
      toast.error('Falha ao enviar', {
        description: error.message || 'Falha ao atualizar a senha!',
      })
    },
  })
}
