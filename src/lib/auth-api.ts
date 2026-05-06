import { ApiError, type ApiErrorResponse } from '@/error'
import ky from 'ky'

const VITE_API_URL_AUTH = import.meta.env.VITE_API_URL_AUTH

function getToken() {
  const authData = localStorage.getItem('@academico:auth')
  const token = authData ? JSON.parse(authData).token : null
  return token
}

function logout() {
  localStorage.removeItem('@academico:auth')
  window.location.href = '/'
}

export const authApi = ky.create({
  retry: 0,
  prefixUrl: VITE_API_URL_AUTH,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = getToken()
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          if (response.status === 401) {
            logout()
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