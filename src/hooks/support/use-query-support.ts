import {
  createSupport,
  getAllSupportTypes,
  type RespostaMensagens,
  type SupportPayload,
  type TipoSuporte,
} from '@/services/support/support.service'
import { AuthStorage } from '@/storage/auth-storage'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useQuerySupportTypes() {
  const { data, isLoading, error, isError } = useQuery<TipoSuporte[]>({
    queryKey: ['support-types'],
    queryFn: async () => {
      return getAllSupportTypes()
    },
    staleTime: Infinity,
    retry: 0,
  })
  return {
    data: data ?? [],
    isLoading,
    error,
    isError,
  }
}

export function useQueryCreateSupport() {
  const queryClient = useQueryClient()

  const mutation = useMutation<RespostaMensagens, any, SupportPayload>({
    mutationFn: async (payload: SupportPayload) => {
      const user = AuthStorage.get()
      if (!user?.user_id) throw new Error('ID do utilizador não encontrado.')

      return await createSupport(user.user_id.toString(), payload)
    },

    onSuccess: (data) => {
      if (data.success) {
        toast.success('O seu pedido de suporte foi enviado com sucesso.')
        queryClient.invalidateQueries({ queryKey: ['student-messages'] })
      } else {
        toast.error(data.message)
      }
    },

    onError: (error: any) => {
      toast.error(
        error?.message ||
          'Ocorreu um erro ao enviar o suporte. Tente novamente.',
      )
    },
  })

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  }
}
