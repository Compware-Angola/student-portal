import { createInvoice, type CreateInvoiceBody } from '@/services/invoice/post-invoice.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useMutationCreateInvoice() {
  const queryClient = useQueryClient()

  const { mutate, mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async (invoiceData: CreateInvoiceBody) => {
      return await createInvoice(invoiceData)
    },

    onSuccess: async () => {
      toast.success('Fatura criada com sucesso!')
      await queryClient.invalidateQueries({ queryKey: ['invoices'] })
    },

    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro ao criar fatura. Tente novamente.'
      toast.error(message)
    },
  })

  return {
    createInvoice: mutate,
    createInvoiceAsync: mutateAsync,
    createInvoicePending: isPending,
    createInvoiceSuccess: isSuccess,
  }
}
