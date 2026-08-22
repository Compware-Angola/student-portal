import {
  type PreInscricaoPayload,
  type PreInscricaoResponse,
  createPreInscricao,
} from '@/services/pre-inscrition/create-pre-inscrition.service'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AuthStorage } from '@/storage/auth-storage'
import { queryClient } from '@/lib/react-query'

export function useMutationPreInscricao() {
  const { mutate, mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async (payload: PreInscricaoPayload) => {
      return await createPreInscricao(payload)
    },

    onSuccess: async (response: PreInscricaoResponse) => {
      // A nova pré-inscrição fica selecionada automaticamente
      if (response?.codigo) {
        AuthStorage.saveSelectedPreinscricao(response.codigo)
      }

      toast.success('Pré-inscrição realizada com sucesso')

      await queryClient.invalidateQueries({ queryKey: ['pre-inscricoes'] })
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
      await queryClient.invalidateQueries({ queryKey: ['pre-inscricao-ficha'] })
    },

    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro ao realizar pré-inscrição. Tente novamente.'

      toast.error(message)
    },
  })

  return {
    createPreInscricao: mutate,
    createPreInscricaoAsync: mutateAsync,
    createPreInscricaoPending: isPending,
    createPreInscricaoSuccess: isSuccess,
  }
}
