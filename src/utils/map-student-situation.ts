import {
  StudentSituation,
  type StudentSituationType,
} from '@/constants/student-situation'

export type StudentType = 'NEW' | 'OLD'

export function mapStudentSituation(statusCode?: number) {
  if (!statusCode) return null

  const valid = Object.values(StudentSituation).includes(
    statusCode as StudentSituationType,
  )

  if (!valid) return null

  const situation = statusCode as StudentSituationType

  const studentType: StudentType =
    situation === StudentSituation.NEW_WITHOUT_ENROLLMENT ||
    situation === StudentSituation.NEW_WITH_CURRENT_CONFIRMATION
      ? 'NEW'
      : 'OLD'

  return {
    situation,
    studentType,
  }
}

export function getEnrollmentRoute(studentType: StudentType) {
  return studentType === 'OLD' ? '/inscricao-uc' : '/matricula'
}

export function getEnrollmentLabel(studentType: StudentType) {
  return studentType === 'OLD' ? 'Inscrição na UC' : 'Matrícula'
}
