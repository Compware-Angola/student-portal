import { formatReadableTimeInterval } from '@/utils/format-readable-time-interval'
import type { AulaHorario } from '../utils'

type AulaItemProps = {
  aula: AulaHorario
}

export function AulaItem({ aula }: AulaItemProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border bg-card hover:bg-muted/40 transition-colors">
      <div className="min-w-[140px] text-sm text-muted-foreground font-medium">
        {formatReadableTimeInterval(aula.hora_inicio, aula.hora_termino)}
      </div>

      <div className="flex-1 space-y-1">
        <div className="font-semibold">{aula.disciplina}</div>
        <div className="text-sm text-muted-foreground flex gap-2">
          <span>{aula.sala}</span>
          <span className="uppercase">{aula.tipo}</span>
        </div>
      </div>
    </div>
  )
}
