import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import type { AulaHorario, DiaSemana } from '../utils'
import { DayFilter } from './day-filter'
import { ScheduleContent } from './schedule-content'

export function ScheduleBody({
  isLoading,
  isError,
  errorMessage,
  schedule,
  diaSelecionado,
  onDiaChange,
}: {
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  schedule: Record<DiaSemana, AulaHorario[]>
  diaSelecionado: string
  onDiaChange: (v: string) => void
}) {
  if (isLoading) {
    return <ScheduleSkeleton />
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar horário</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    )
  }

  return (
    <>
      <DayFilter
        value={diaSelecionado}
        onChange={onDiaChange}
        schedule={schedule}
      />
      <ScheduleContent schedule={schedule} diaSelecionado={diaSelecionado} />
    </>
  )
}

function ScheduleSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Skeleton className="h-9 w-48" />
      </div>

      <div className="grid gap-4">
        {[1, 2, 3].map((day) => (
          <Card key={day}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border"
                  >
                    <div className="flex-shrink-0 min-w-[140px]">
                      <Skeleton className="h-5 w-28" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <div className="flex gap-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
