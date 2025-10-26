import { ApiError, type ApiErrorResponse } from '@/error'
import { AuthStorage } from '@/storage/auth-storage'
import ky from 'ky'

const VITE_API_URL_APEX = import.meta.env.VITE_API_URL_APEX

export const apexApi = ky.create({
  prefixUrl: VITE_API_URL_APEX,
  credentials: 'include',
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
      async (request, _options, response) => {
        if (!response.ok) {
          if (
            response.status === 401 &&
            !request.url.includes('/api/v1/auth')
          ) {
            AuthStorage.clear()
          }
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
