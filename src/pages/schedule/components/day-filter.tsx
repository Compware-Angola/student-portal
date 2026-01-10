import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AulaHorario } from '../utils'

export function DayFilter({
  value,
  onChange,
  schedule,
}: {
  value: string
  onChange: (v: string) => void
  schedule: Record<string, AulaHorario[]>
}) {
  const dias = ['Todos', ...Object.keys(schedule)]

  return (
    <div className="max-w-48">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filtrar por dia" />
        </SelectTrigger>
        <SelectContent>
          {dias.map((dia) => (
            <SelectItem key={dia} value={dia}>
              {dia}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
