import { useQueryAcademicYearStudent } from '@/hooks/academic-year/use-query-academic-year-student'
import { useQueryCurrentAcademicYear } from '@/hooks/academic-year/use-query-current-academic-year'
import { dedupeAcademicYears } from '@/utils/dedupe-academic-years'
import { useMemo } from 'react'

export function useYearSelect(enrollmentCode?: string) {
  const { data: academicYearData } = useQueryAcademicYearStudent(enrollmentCode)

  const { data: currentAcademicYear } = useQueryCurrentAcademicYear()

  const academicYears = useMemo(() => {
    if (!academicYearData?.anolectivos) return []

    const years = [...academicYearData.anolectivos]

    if (currentAcademicYear) {
      const exists = years.some(
        (y) => Number(y.codigo) === Number(currentAcademicYear.codigo),
      )

      if (!exists) {
        years.push({
          codigo: currentAcademicYear.codigo,
          designacao: currentAcademicYear.designacao,
          estado: 'Activo',
        })
      }
    }

    return dedupeAcademicYears(
      years.sort((a, b) => Number(b.codigo) - Number(a.codigo)),
    )
  }, [academicYearData, currentAcademicYear])

  const defaultYear = useMemo(
    () => academicYears.find((y) => y.estado === 'Activo')?.codigo?.toString(),
    [academicYears],
  )

  return { academicYears, defaultYear }
}
