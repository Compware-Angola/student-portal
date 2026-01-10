import { Card, CardContent } from '@/components/ui/card'
import type { AulaHorario, DiaSemana } from '../utils'
import { Calendar } from 'lucide-react'
import { DayCard } from './day-card'

export function ScheduleContent({
  schedule,
  diaSelecionado,
}: {
  schedule: Record<DiaSemana, AulaHorario[]>
  diaSelecionado: string
}) {
  const diasParaMostrar =
    diaSelecionado === 'Todos'
      ? Object.entries(schedule)
      : Object.entries(schedule).filter(([d]) => d === diaSelecionado)

  const temAulas = diasParaMostrar.some(([, aulas]) => aulas.length > 0)

  if (!temAulas) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Calendar className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">
            Nenhuma aula para{' '}
            {diaSelecionado === 'Todos' ? 'a semana' : diaSelecionado}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {diasParaMostrar.map(
        ([dia, aulas]) =>
          aulas.length > 0 && <DayCard key={dia} dia={dia} aulas={aulas} />,
      )}
    </div>
  )
}
