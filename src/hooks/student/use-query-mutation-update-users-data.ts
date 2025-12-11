import {
  updateUser,
  type UpdateUserParams,
} from '@/services/students/update-users-data.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * Hook React Query para atualizar os dados de um usuário
 */
export function useUpdateUser(userId: string) {
  const queryClient = useQueryClient()

  return useMutation<{ message: string }, Error, UpdateUserParams>({
    mutationFn: (params) => {
      if (!userId) {
        throw new Error('UserId é obrigatório')
      }
      return updateUser(userId, params)
    },
    onSuccess: (data) => {
      toast.success('Sucesso', {
        description: data.message || 'Dados atualizados com sucesso!',
      })

      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (error) => {
      toast.error('Falha ao atualizar', {
        description: error.message || 'Erro ao atualizar os dados do usuário.',
      })
    },
  })
}
