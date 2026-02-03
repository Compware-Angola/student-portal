export type EnrollmentGrade = {
  codigoGrade: number
  codigoHorario: number | null
  descHorario: string
}

export type ConfirmEnrollmentPayload = {
  codPreInscricao: number
  grades: EnrollmentGrade[]
  semestre: number
}

import { gaApi } from '@/lib/ga-api'

export async function confirmOldEnrollmentService(
  payload: ConfirmEnrollmentPayload
) {
  return gaApi
    .post('enrollment/confirm', {
      json: payload,
    })
    .json()
}
