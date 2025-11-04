// src/services/payment-reference/generate-reference.service.ts
import { invoiceApi as Api } from '@/lib/invoice-api'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

// === Tipos ===
export interface GenerateReferenceParams {
  codigoFactura: number
}

export interface GenerateReferenceResponse {
  message: string
  taskId: string
  invoiceId: number
}

const PENDING_TASKS_KEY = 'pending_payment_tasks'

// === Função API (reutilizável) ===
export async function generateReference(
  params: GenerateReferenceParams
): Promise<GenerateReferenceResponse> {
  const url = `payment-references/renew/reference/${params.codigoFactura}`

  const res = await Api.patch(url, {
    json: { codigoFactura: params.codigoFactura },
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Erro ao iniciar geração da referência')
  }

  return res.json<GenerateReferenceResponse>()
}

// === Hook com lógica de localStorage + toast ===
export function useGenerateReference() {

  return useMutation({
    mutationFn: generateReference,
    onSuccess: (data) => {
      // Atualiza localStorage
      const pendingTasks: { invoiceId: number; taskId: string }[] = JSON.parse(
        localStorage.getItem(PENDING_TASKS_KEY) || '[]'
      )
      const filtered = pendingTasks.filter(t => t.invoiceId !== data.invoiceId)
      const updated = [...filtered, { invoiceId: data.invoiceId, taskId: data.taskId }]
      localStorage.setItem(PENDING_TASKS_KEY, JSON.stringify(updated))

      // Feedback
      toast.info('Geração iniciada. Verificando status...')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Falha ao iniciar geração.')
    },
  })
}