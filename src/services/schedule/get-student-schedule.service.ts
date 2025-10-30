import { apexApi } from '@/lib/apex-api'
import type { StudentSchedule } from '@/types/schedule'
export type StudentScheduleResponse = {
  codresposta: number
  msgresposta: string
  horarios: StudentSchedule[]
}

/**
 * Obtém os horários do aluno por ano letivo e código de pré-inscrição.
 * @param anoletivo - Código do ano letivo (ex: 22)
 * @param codpreinscricao - Código de pré-inscrição (ex: 114525)
 */
export async function getStudentSchedule(
  anoletivo: string,
  codpreinscricao: string,
): Promise<StudentScheduleResponse> {
  const endpoint = `schedule/students/${anoletivo}/${codpreinscricao}`
  return apexApi.get(endpoint).json<StudentScheduleResponse>()
}
