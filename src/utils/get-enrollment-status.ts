import { isBefore, isAfter, parseISO } from 'date-fns'


import { EnrollmentStatus } from '@/constants/enrollment-status'
import type { FetchEnrollmentPeriodStudentsOldResponse } from '@/services/prazos-matriculas/get-prazos-matriculas.service'

/**
 * Determina o estado da matrícula com base nas datas
 */
export function getEnrollmentStatus(data: FetchEnrollmentPeriodStudentsOldResponse | undefined | null) {
  if (!data || !data?.calendario?.length) {
    return EnrollmentStatus.CLOSED
  }
  const inicio = parseISO(data.calendario[0].data_inicio)
  const termino = parseISO(data.calendario[0].data_termino)
  const hoje = new Date()

  if (isBefore(hoje, inicio)) {
    return EnrollmentStatus.NOT_YET_OPEN
  }

  if (isAfter(hoje, termino)) {
    return EnrollmentStatus.CLOSED
  }

  return EnrollmentStatus.OPEN
}
