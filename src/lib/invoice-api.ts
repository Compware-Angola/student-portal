// src/api/invoiceApi.ts (ou onde estiver)
import { ApiError, type ApiErrorResponse } from '@/error'
import ky from 'ky'

const VITE_API_URL_INVOICE = import.meta.env.VITE_API_URL_INVOICE

export const invoiceApi = ky.create({
  prefixUrl: VITE_API_URL_INVOICE,
  retry: 0,
  timeout: 70_000, // 60 segundos
  hooks: {
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          let errorData: ApiErrorResponse | undefined
          let message = `Erro ${response.status}: ${response.statusText}`

          const text = await response.text()
          if (text) {
            try {
              const json = JSON.parse(text) as ApiErrorResponse
              errorData = json
              message = json.message || json.error || message
            } catch {
              message = text.trim() || message
            }
          }

          throw new ApiError(message, response.status, errorData)
        }
      },
    ],
  },
})

