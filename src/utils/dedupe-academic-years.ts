export type AcademicYear = {
  codigo: string
  designacao: string
  estado: string
}

export function dedupeAcademicYears(list?: AcademicYear[]): AcademicYear[] {
  if (!list) return []

  const map = new Map<AcademicYear['codigo'], AcademicYear>()

  list.forEach((item) => {
    map.set(String(item.codigo), item)
  })

  return Array.from(map.values())
}


