import { gaApi } from '@/lib/ga-api'

export type BeginningStudentProcessPayload = {
  name: string
  telefone: string
  email: string| undefined
  tipo_de_documento: number
  numero_documento: string
  password: string
  canal: number
  grauacademico: string
  faculdade?: string
}

export type BeginningStudentProcessResponse = {
  message: string
  data: {
    id?: number
    codEstudante?: number
  }
}

export async function beginningStudentProcessService(
  payload: BeginningStudentProcessPayload,
) {
  return gaApi
    .post('beginning-student-process', {
      json: payload,
    })
    .json<BeginningStudentProcessResponse>()
}
