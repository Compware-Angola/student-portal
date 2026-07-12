import {
  type PreInscricaoPayload,
  createPreInscricao,
} from '@/services/pre-inscrition/create-pre-inscrition.service'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useMutationPreInscricao() {
  const { mutate, mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async (payload: PreInscricaoPayload) => {
      return await createPreInscricao(payload)
    },

    onSuccess: async () => {
      toast.success('Pré-inscrição realizada com sucesso')

      // await queryClient.invalidateQueries({
      //   queryKey: ['pre-inscricoes'],
      // })
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
