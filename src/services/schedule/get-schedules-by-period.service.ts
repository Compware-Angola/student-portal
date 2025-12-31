import { gaApi } from '@/lib/ga-api'
export type ScheduleLessonDto = {
  docenteId: number
  docenteNome: string
  tipoAula: string
  modalidade: string
  diaSemana: string
  ordemDiaSemana: number
  sala: string
  horaInicio: string
  horaTermino: string
}

export type ScheduleByPeriodDto = {
  codigo: number
  anoLectivo: string
  designacao: string
  unidadeCurricularId: number
  disciplina: string
  curso: string
  capacidade: number
  reservado: string
  periodo: number
  estado: string
  estadoCor: string | null
  estadoId: number
  disponibilidade: string
  criadoPor: string
  atualizadoPor: string
  dataCriacao: string
  dataUltimaAtualizacao: string
  aulas: ScheduleLessonDto[]
}

export type GetSchedulesByPeriodParams = {
  anoLectivo?: number
  periodo?: number
  gradeCurricular?: number
}

export async function getSchedulesByPeriod(
  params?: GetSchedulesByPeriodParams,
): Promise<ScheduleByPeriodDto[]> {
  const cleanParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined),
      )
    : {}

  return gaApi
    .get('schedule/by-ano-periodo-grade', {
      searchParams: cleanParams,
    })
    .json<ScheduleByPeriodDto[]>()
}
