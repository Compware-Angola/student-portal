import type { Disciplina } from '@/services/curriculum/get-curriculum-by-course.service'

export function groupByAnoESemestre(data: Disciplina[]) {
  const result: Record<string, Record<string, Disciplina[]>> = {}

  for (const item of data) {
    if (!result[item.classe]) {
      result[item.classe] = {}
    }

    if (!result[item.classe][item.semestre]) {
      result[item.classe][item.semestre] = []
    }

    const exists = result[item.classe][item.semestre].some(
      (d) => d.disciplina === item.disciplina,
    )
    if (!exists) {
      result[item.classe][item.semestre].push(item)
    }
  }

  return result
}
