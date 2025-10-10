import ky from 'ky'

const API_URL = import.meta.env.VITE_API_URL

export type ApiErrorResponse = {
  message?: string
  error?: string
}

export class ApiError extends Error {
  status: number
  data?: ApiErrorResponse

  constructor(message: string, status: number, data?: ApiErrorResponse) {
    super(message)
    this.status = status
    this.data = data
  }
}

export const api = ky.create({
  prefixUrl: API_URL,
  credentials: 'include',
  hooks: {
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
