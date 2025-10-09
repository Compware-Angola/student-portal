import ky from 'ky'

const API_URL = 'http://192.168.30.45:3000/api'

type ApiErrorResponse = {
  message?: string
  error?: string
  [key: string]: any
}

export const api = ky.create({
  prefixUrl: API_URL,
  credentials: 'include',
  hooks: {
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          try {
            const errorData = (await response.json()) as ApiErrorResponse

            const error = new Error(
              errorData?.message ||
                errorData?.error ||
                `Erro ${response.status}`,
            ) as Error & { data?: ApiErrorResponse; status?: number }

            error.data = errorData
            error.status = response.status
            throw error
          } catch (e) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`)
          }
        }
      },
    ],
  },
})
