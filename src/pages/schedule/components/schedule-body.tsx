import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, LayoutGrid, List, Calendar } from 'lucide-react'
import type { AulaHorario, DiaSemana } from '../utils'
import { ScheduleGrid } from './schedule-grid'
import { DayCard } from './day-card'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
type Props = {
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  schedule: Record<DiaSemana, AulaHorario[]>
}

export function ScheduleBody({ isLoading, isError, errorMessage, schedule }: Props) {
  if (isLoading) return <ScheduleSkeleton />


  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar horário</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    )
  }
  const diasComAulas = Object.entries(schedule).filter(([, aulas]) => aulas.length > 0)

  // 🔥 estado do dia selecionado
  const [diaSelecionado, setDiaSelecionado] = useState<string>(
    diasComAulas[0]?.[0] || ''
  )

  if (diasComAulas.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Calendar className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">Nenhuma aula para este período</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="grid" className="space-y-4">
      <TabsList>
        <TabsTrigger value="grid" className="gap-2">
          <LayoutGrid className="h-4 w-4" />
          Grelha semanal
        </TabsTrigger>
        <TabsTrigger value="list" className="gap-2">
          <List className="h-4 w-4" />
          Por dia
        </TabsTrigger>
      </TabsList>

      <TabsContent value="grid">
        <ScheduleGrid schedule={schedule} />
      </TabsContent>

      <TabsContent value="list">
        <div className="space-y-4">

          {/* SELECT */}
          <div className="w-full flex justify-end items-center gap-2">
            <label className="text-sm font-medium">Selecionar dia:</label>

            <Select
              value={diaSelecionado}
              onValueChange={(value) => setDiaSelecionado(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Escolher dia" />
              </SelectTrigger>

              <SelectContent>
                {diasComAulas.map(([dia]) => (
                  <SelectItem key={dia} value={dia}>
                    {dia}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* DIA SELECIONADO */}
          {diasComAulas
            .filter(([dia]) => dia === diaSelecionado)
            .map(([dia, aulas]) => (
              <DayCard key={dia} dia={dia} aulas={aulas} />
            ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}

function ScheduleSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-28" />
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="min-w-[900px] p-4 space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-8 flex-1" />)}
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-2">
                <Skeleton className="h-14 w-16" />
                {[1, 2, 3, 4, 5].map((j) => <Skeleton key={j} className="h-14 flex-1" />)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}