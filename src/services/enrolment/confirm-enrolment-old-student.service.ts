import { apexApi } from '@/lib/apex-api'

export type OldStudentGrade = {
  codigoGrade: string
  codigoHorario: string | null
  descHorario: string
}

export type ConfirmEnrolmentOldStudentBody = {
  enrollmentCode: string
  grades: OldStudentGrade[]
}

export async function confirmEnrolmentOldStudent(
  params: ConfirmEnrolmentOldStudentBody,
): Promise<void> {
  return apexApi
    .post(`enrollment/oldstudent/${params.enrollmentCode}`, {
      json: {
        grades: params.grades,
      },
    })
    .json()
}
