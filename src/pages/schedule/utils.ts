import type { StudentSchedule } from "@/types/schedule"

export type DiaSemana = string

export type AulaHorario = {
  hora_inicio: string
  hora_termino: string
  disciplina: string
  sala: string
  tipo: string
  professor?: string
}

export function obterDiaAtual(): string {
  const dias = [
    'Domingo', 'Segunda-feira', 'Terça-feira',
    'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado',
  ]
  return dias[new Date().getDay()] ?? 'Todos'
}



export const organizarPorDia = (
  scheduleData: StudentSchedule[],
): Record<DiaSemana, AulaHorario[]> => {
  const diasSemana: Record<DiaSemana, AulaHorario[]> = {
    'Segunda-Feira': [],
    'Terça-Feira': [],
    'Quarta-Feira': [],
    'Quinta-Feira': [],
    'Sexta-Feira': [],
    'Sábado': [],
    "Domingo": []
  }

  if (!scheduleData?.length) return diasSemana

  scheduleData.forEach((disciplina) => {
    disciplina.detalhes_aulas.forEach((aula) => {
      const dia = aula.designacao as DiaSemana
      if (dia in diasSemana) {
        diasSemana[dia].push({
          hora_inicio: aula.hora_inicio,
          hora_termino: aula.hora_termino,
          disciplina: disciplina.nome_disciplina,
          sala: aula.sala,
          tipo: aula.tipo,
        })
      }
    })
  })

  Object.values(diasSemana).forEach((aulas) =>
    aulas.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio)),
  )

  return diasSemana
}
function formatToMinutes(time?: string | null): number | null {
  if (!time) return null

  let h: number
  let m: number

  // ISO format
  if (time.includes('T')) {
    const t = time.split('T')[1]?.slice(0, 5)
    if (!t) return null

    const parts = t.split(':')
    if (parts.length !== 2) return null

    h = Number(parts[0])
    m = Number(parts[1])
  } else {
    const parts = time.split(':')
    if (parts.length !== 2) return null

    h = Number(parts[0])
    m = Number(parts[1])
  }

  if (isNaN(h) || isNaN(m)) return null

  return h * 60 + m
}
export function formatHoras(totalHoras: number): string {
  const horas = Math.floor(totalHoras)
  const minutos = Math.round((totalHoras - horas) * 60)

  return `${horas}h ${minutos}min`
}
export function calcularTotalHoras(
  schedule: Record<DiaSemana, AulaHorario[]>
): number {
  return Object.values(schedule).reduce((acc, aulas) => {
    return (
      acc +
      aulas.reduce((s, a) => {
        const inicio = formatToMinutes(a.hora_inicio)
        const fim = formatToMinutes(a.hora_termino)

        if (inicio === null || fim === null) return s

        return s + (fim - inicio) / 60
      }, 0)
    )
  }, 0)
}

export function calcularTotalAulas(schedule: Record<DiaSemana, AulaHorario[]>): number {
  return Object.values(schedule).reduce((acc, aulas) => acc + aulas.length, 0)
}