import ky from 'ky'

const API_URL = import.meta.env.VITE_API_URL
const IS_DEV = import.meta.env.DEV

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}


type ApiErrorResponse = {
  message?: string
  error?: string
  [key: string]: any
}

export const api = ky.create({
  prefixUrl: API_URL,
  credentials: 'include',
  hooks: {
    beforeRequest: [
      async (request) => {
        if (IS_DEV) {
          const randomDelay = 300 + Math.random() * 900
          await delay(randomDelay)
          console.log(`⏳ Delay de ${Math.round(randomDelay)}ms → ${request.url}`)
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          try {
            const errorData = (await response.json()) as ApiErrorResponse

           
            const error = new Error(
              errorData?.message ||
              errorData?.error ||
              `Erro ${response.status}`
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
