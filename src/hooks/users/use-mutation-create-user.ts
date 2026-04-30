import { type BeginningStudentProcessPayload, beginningStudentProcessService } from '@/services/users/create-user.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'


export function useMutationBeginningStudentProcess() {
  const queryClient = useQueryClient()

  const { mutate, mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async (payload: BeginningStudentProcessPayload) => {
      return await beginningStudentProcessService(payload)
    },

    onSuccess: async () => {
      toast.success('Processo de estudante iniciado com sucesso')
      await queryClient.invalidateQueries({
        queryKey: ['beginning-student-process'],
      })
    },

    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro ao iniciar processo de estudante. Tente novamente.'
      toast.error(message)
    },
  })

  return {
    createBeginningStudentProcess: mutate,
    createBeginningStudentProcessAsync: mutateAsync,
    createBeginningStudentProcessPending: isPending,
    createBeginningStudentProcessSuccess: isSuccess,
  }
}
