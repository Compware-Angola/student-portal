import { ApiError, type ApiErrorResponse } from '@/error'
import { AuthStorage } from '@/storage/auth-storage'
import ky from 'ky'

const VITE_API_URL_GA = import.meta.env.VITE_API_URL_GA
export const gaApi = ky.create({
  retry: 0,
  prefixUrl: VITE_API_URL_GA,

  hooks: {
    beforeRequest: [
      (request) => {
        const token = AuthStorage.getToken()

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        // if (response.status === 401) {
        //   console.lo
        // }
        if (!response.ok) {
          let errorData: ApiErrorResponse | undefined
          let message = `Erro ${response.status}: ${response.statusText}`

          // PRIMEIRO: tenta ler como text (sempre funciona)
          const text = await response.text()

          if (text) {
            try {
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
