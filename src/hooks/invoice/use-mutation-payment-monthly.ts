import {
  createPaymentReferenceMensalidades,
  type CreatePaymentReferenceBody,
} from '@/services/invoice/post-invoice-monthly.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * Hook React Query para criar referência de pagamento de mensalidades.
 */
export function useMutationCreatePaymentReferenceMensalidades() {
  const queryClient = useQueryClient()

  const { mutate, mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async (paymentData: CreatePaymentReferenceBody) => {
      return await createPaymentReferenceMensalidades(paymentData)
    },

    onSuccess: async () => {
      toast.success('Referências das  mensalidades criadas com sucesso!')
      await queryClient.invalidateQueries({
        queryKey: ['payment-references'],
      })
    },

    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro ao criar referências das mensalidades. Tente novamente.'
      toast.error(message)
    },
  })

  return {
    createPaymentReference: mutate,
    createPaymentReferenceAsync: mutateAsync,
    createPaymentReferencePending: isPending,
    createPaymentReferenceSuccess: isSuccess,
  }
}
