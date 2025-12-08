import { apexApi } from '@/lib/apex-api'
type ConfirmEnrolmentNewStudentBody = {
  studentId: string
  grades: string[]
}

type EnrollmentResponse = {
  Codigo_Matricula: number
  Numero_Aluno: number
  codresposta: number
  msgresposta: string
}

export function confirmEnrolmentNewStudent(
  params: ConfirmEnrolmentNewStudentBody,
): Promise<EnrollmentResponse> {
  return apexApi
    .post(`enrollment/newstudent/${params.studentId}`, {
      json: { grades: params.grades },
    })
    .json()
}
