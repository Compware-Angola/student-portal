// use-unlock-test.mutation.ts


import { type UnlockTestPayload, unlockTest } from '@/services/pre-inscrition/unlock-test-pre-inscription-password.service'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useMutationUnlockTest() {
  const { mutate, mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async (payload: UnlockTestPayload) => {
      return await unlockTest(payload)
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro ao desbloquear a prova. Tente novamente.'
      toast.error(message)
    },
  })

  return {
    unlockTest: mutate,
    unlockTestAsync: mutateAsync,
    unlockTestPending: isPending,
    unlockTestSuccess: isSuccess,
  }
}