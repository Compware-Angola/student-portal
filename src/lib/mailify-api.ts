import { ApiError, type ApiErrorResponse } from '@/error'
import { AuthStorage } from '@/storage/auth-storage'
import ky from 'ky'

const VITE_API_URL_MAILIFY = import.meta.env.VITE_API_URL_MAILIFY

export const mailifyApi = ky.create({
  retry: 0,
  prefixUrl: VITE_API_URL_MAILIFY,
  timeout: false,
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
        if (!response.ok) {
          if (response.status === 401) {
            AuthStorage.clear()
            window.location.href = '/login'
            return
          }

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