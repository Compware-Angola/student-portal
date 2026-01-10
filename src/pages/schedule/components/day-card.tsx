import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AulaHorario } from '../utils'
import { AulaItem } from './aula-item'

type DayCardProps = {
  dia: string
  aulas: AulaHorario[]
}

export function DayCard({ dia, aulas }: DayCardProps) {
  return (
    <Card className="shadow-sm border border-muted/30">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{dia}</CardTitle>
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
