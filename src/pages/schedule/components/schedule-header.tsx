import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays } from 'lucide-react'
import { YearSelect } from '@/components/year-select'
import type { AcademicYear } from '@/utils/dedupe-academic-years'
import type { DiaSemana, AulaHorario } from '../utils'
import { calcularTotalAulas, calcularTotalHoras, formatHoras } from '../utils'

type Props = {
  academicYears: AcademicYear[]
  selectedYear?: string
  onYearChange: (year: string) => void
  schedule: Record<DiaSemana, AulaHorario[]>
}

export function ScheduleHeader({ academicYears, selectedYear, onYearChange, schedule }: Props) {
  const totalAulas = calcularTotalAulas(schedule)
  const total = calcularTotalHoras(schedule)
  const totalHoras = formatHoras(total)
  const diasAtivos = Object.values(schedule).filter((a) => a.length > 0).length

  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <CalendarDays className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Horário de Aulas</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Consulte o seu horário semanal e detalhes das aulas
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <YearSelect
              academicYears={academicYears}
              selectedYear={selectedYear}
              onChange={onYearChange}
            />
            {/*
            <Button variant="outline" size="icon" title="Imprimir">
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" title="Exportar PDF">
              <Download className="h-4 w-4" />
            </Button>
            */}
          </div>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Disciplinas</p>
            <p className="text-xl font-bold mt-1">{totalAulas}</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Horas semanais</p>
            <p className="text-xl font-bold mt-1">{totalHoras}</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Dias activos</p>
            <p className="text-xl font-bold mt-1">{diasAtivos}</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Turno</p>
            <p className="text-xl font-bold mt-1">Diurno</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}