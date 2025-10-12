import type { IEnrollment } from '@/pages/enrollment/types/enrollment'
import type { Enrollment } from '@/services/enrollment.service'

export const getAllAvaliableEnrollments = (enrollments: IEnrollment[]) => {
  return enrollments.filter(
    (enrollment) => enrollment.enrollmentStatus == 'ACTIVE_REGULAR',
  )
}
export const getAllHIstoricEnrollments = (enrollments: IEnrollment[]) => {
  return enrollments.filter(
    (enrollment) => enrollment.enrollmentStatus != 'ACTIVE_REGULAR',
  )
}
export const formatMonthYear = (dateString: string) => {
  if (!dateString) return ''
  const formatted = new Date(dateString)
    .toLocaleDateString('pt-AO', { month: 'long', year: 'numeric' })
    .replace(' de ', ' ')
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export const formatCurrency = (value: number | string) => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return num.toLocaleString('pt-AO', {
    style: 'currency',
    currency: 'AOA',
  })
}

export const isVerifiedToEnrollment = (
  enrollment: Enrollment[] | undefined,
  isTimeToConfirm: boolean,
  academicYear: string | undefined
): boolean => {
  if (!enrollment || enrollment.length === 0  ) {
    return false
  }
  if(!academicYear ||academicYear == '2025-2026') return false
  const firstEnrollment = enrollment[0]

  return (
    isTimeToConfirm && firstEnrollment?.enrollmentStatus === 'ACTIVE_REGULAR'
  )
}

export const isNewStudent = (enrollment: Enrollment[] | undefined) => {
  if (enrollment == undefined) return;
  if (enrollment && enrollment.length == 0) return true
  return false
}
