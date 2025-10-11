import { ApiError, type ApiErrorResponse } from '@/error'
import ky from 'ky'

const API_URL = import.meta.env.VITE_API_URL

export const api = ky.create({
  prefixUrl: API_URL,
  credentials: 'include',
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem('token')
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
            localStorage.removeItem('token')
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
