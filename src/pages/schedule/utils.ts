import type { StudentSchedule } from '@/types/schedule'

export type DiaSemana =
  | 'Segunda-Feira'
  | 'Terça-Feira'
  | 'Quarta-Feira'
  | 'Quinta-Feira'
  | 'Sexta-Feira'
  | 'Sábado'

export type AulaHorario = {
  hora_inicio: string
  hora_termino: string
  disciplina: string
  sala: string
  tipo: string
}
export const obterDiaAtual = () => {
  const dias = [
    'Domingo',
    'Segunda-Feira',
    'Terça-Feira',
    'Quarta-Feira',
    'Quinta-Feira',
    'Sexta-Feira',
    'Sábado',
  ]
  return dias[new Date().getDay()]
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
