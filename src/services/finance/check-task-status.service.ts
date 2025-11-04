// src/services/payment-reference/check-task-status.service.ts
import { invoiceApi as Api } from '@/lib/invoice-api'

export type TaskStatus = 'pending' | 'completed' | 'error'

export interface CheckTaskStatusResponse {
  status: TaskStatus
}

/**
 * Verifica o status de uma task de geração de referência
 * @param taskId ID da task retornado pelo backend
 * @returns Status da task
 */
export async function checkTaskStatus(taskId: string): Promise<CheckTaskStatusResponse> {
  const url = `payment-references/status/${taskId}`

  const res = await Api.get(url)

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Task não encontrada')
  }

  return res.json<CheckTaskStatusResponse>()
}