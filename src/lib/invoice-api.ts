import { ApiError, type ApiErrorResponse } from '@/error'

import ky from 'ky'

const VITE_API_URL_INVOICE = import.meta.env.VITE_API_URL_INVOICE

export const invoiceApi = ky.create({
  retry: 0,
  prefixUrl: VITE_API_URL_INVOICE,

  hooks: {
    afterResponse: [
      async (_, _options, response) => {
        if (!response.ok) {
          try {
            const errorData = (await response.json()) as ApiErrorResponse
            const message =
              errorData?.message ||
              errorData?.error ||
              `Erro ${response.status}`

            throw new ApiError(message, response.status, errorData)
          } catch {
            throw new ApiError(
              `Erro ${response.status}: ${response.statusText}`,
              response.status,
            )
          }
        }
      },
    ],
  },
})
