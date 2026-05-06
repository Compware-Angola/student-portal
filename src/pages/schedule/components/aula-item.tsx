import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, User } from 'lucide-react'
import type { AulaHorario } from '../utils'

// 🔥 formatar hora (HH:mm)
const formatTime = (time?: string | null): string => {
  if (!time) return ''
  if (time.includes('T')) return time.split('T')[1]?.slice(0, 5) || ''
  return time.slice(0, 5)
}

type Props = { aula: AulaHorario }

export function AulaItem({ aula }: Props) {
  return (
    <div className="relative pl-4 border-l-4 border-l-primary/60 py-2 pr-3 rounded-r-md bg-muted/30 hover:bg-muted/60 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="font-semibold text-sm">{aula.disciplina}</div>
        <Badge variant="outline" className="text-[10px]">
          {aula.tipo}
        </Badge>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatTime(aula.hora_inicio)} - {formatTime(aula.hora_termino)}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {aula.sala}
        </span>
        {aula.professor && (
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {aula.professor}
          </span>
        )}
      </div>
    </div>
  )
}