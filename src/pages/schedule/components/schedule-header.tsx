import { YearSelect } from '@/components/year-select'
import type { AcademicYear } from '@/utils/dedupe-academic-years'

type ScheduleHeaderProps = {
  academicYears: AcademicYear[]
  selectedYear?: string
  onYearChange: (year: string) => void
}

export function ScheduleHeader({
  academicYears,
  selectedYear,
  onYearChange,
}: ScheduleHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <h1 className="text-3xl font-bold">Meu Horário</h1>

      <YearSelect
        academicYears={academicYears}
        selectedYear={selectedYear}
        onChange={onYearChange}
      />
    </div>
  )
}
