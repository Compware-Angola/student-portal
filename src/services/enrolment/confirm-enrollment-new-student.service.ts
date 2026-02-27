import { gaApi } from '@/lib/ga-api'

export type EnrollmentDiscipline = {
  codigo: number
  duracaoDisciplina: string
  semestre: number
}

export type EnrollmentPayload = {
  codPreInscricao: string
  grades: EnrollmentDiscipline[]
}

export type EnrollmentResponse = {
  message: string
  data: {
    codMatricula: number
  }
}
export async function enrollmentService(payload: EnrollmentPayload) {
  return gaApi
    .post('enrollment', {
      json: payload,
    })
    .json<EnrollmentResponse>()
}
