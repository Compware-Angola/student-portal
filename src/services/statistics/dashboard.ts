import { apexApi } from '@/lib/apex-api'

export type StudentDashboardStatistics = {
  codigo_matricula: string
  valor_divida?: number
  quantidade_disciplinas_aprovadas: number
}

export async function getStudentDashboardStatistics(
  matricula: string,
): Promise<StudentDashboardStatistics> {
  const endpoint = `statistic/dashboard/${matricula}`
  return apexApi.get(endpoint).json<StudentDashboardStatistics>()
}
