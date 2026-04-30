import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays } from 'lucide-react'
import type { AulaHorario } from '../utils'
import { AulaItem } from './aula-item'

type Props = { dia: string; aulas: AulaHorario[] }

export function DayCard({ dia, aulas }: Props) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            {dia}
          </CardTitle>
          <Badge variant="secondary">
            {aulas.length} {aulas.length === 1 ? 'aula' : 'aulas'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {aulas.map((aula, index) => (
            <AulaItem key={index} aula={aula} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}