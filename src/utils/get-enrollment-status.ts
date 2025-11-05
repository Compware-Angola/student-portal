import { isBefore, isAfter, parseISO } from 'date-fns'

import type { AcademicActivity } from '@/services/academic/activity-academic-confirmation-student.service'
import { EnrollmentStatus } from '@/constants/enrollment-status'

/**
 * Determina o estado da matrícula com base nas datas
 */
export function getEnrollmentStatus(data: AcademicActivity) {
  if (!data) {
    return EnrollmentStatus.CLOSED
  }
  const atividade = data
  const inicio = parseISO(atividade.data_inicio)
  const termino = parseISO(atividade.data_termino)
  const hoje = new Date()

  if (isBefore(hoje, inicio)) {
    return EnrollmentStatus.NOT_YET_OPEN
  }

  if (isAfter(hoje, termino)) {
    return EnrollmentStatus.CLOSED
  }

  return EnrollmentStatus.OPEN
}
