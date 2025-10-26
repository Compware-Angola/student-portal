import { apexApi } from '@/lib/apex-api'
type ConfirmEnrolmentNewStudentBody = {
  studentId: string
  grades: string[]
}

export function confirmEnrolmentNewStudent(
  params: ConfirmEnrolmentNewStudentBody,
): Promise<void> {
  return apexApi
    .post(`enrollment/newstudent/${params.studentId}`, {
      json: { grades: params.grades },
    })
    .json()
}
