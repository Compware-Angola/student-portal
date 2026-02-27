import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type YearSelectProps = {
  academicYears?: { codigo: string; designacao: string }[]
  selectedYear?: string
  onChange: (value: string) => void
}
export function YearSelect({
  academicYears = [],
  selectedYear,
  onChange,
}: YearSelectProps) {
  return (
    <Select value={selectedYear} onValueChange={onChange}>
      <SelectTrigger className="min-w-32">
        <SelectValue placeholder="Selecione o ano letivo" />
      </SelectTrigger>
      <SelectContent>
        {academicYears.map((year) => (
          <SelectItem key={year.codigo} value={String(year.codigo)}>
            {year.designacao}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
