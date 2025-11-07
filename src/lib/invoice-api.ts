// src/api/invoiceApi.ts (ou onde estiver)
import { ApiError, type ApiErrorResponse } from '@/error'
import ky from 'ky'

const VITE_API_URL_INVOICE = import.meta.env.VITE_API_URL_INVOICE

export const invoiceApi = ky.create({
  retry: 0,
  prefixUrl: VITE_API_URL_INVOICE,
  hooks: {
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          let errorData: ApiErrorResponse | undefined
          let message = `Erro ${response.status}: ${response.statusText}`

          // PRIMEIRO: tenta ler como text (sempre funciona)
          const text = await response.text()

          if (text) {
            try {
              // SEGUNDO: tenta parsear como JSON
              const json = JSON.parse(text) as ApiErrorResponse
              errorData = json
              message = json.message || json.error || message
            } catch {
              // Se não for JSON válido, usa o texto puro
              message = text.trim() || message
            }
          }

          throw new ApiError(message, response.status, errorData)
        }
      },
    ],
  },
})