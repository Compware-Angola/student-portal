import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Clock,
  MapPin,
  User,
  CalendarDays,
  AlertCircle,
  RefreshCw,
  CalendarX2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { LessonDetail, Schedule } from '@/types/schedule'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useQueryCurriculumSchedule } from '@/hooks/curriculum/use-query-curriculum-schedule'
import { useEffect, useState } from 'react'
import { useEnrollment } from './hooks/use-enrollment'
import { toast } from 'sonner'

interface ScheduleSelectionDialogProps {
  subjectName: string
  codigoGrade: string
}

// Componente de Skeleton para Loading
const ScheduleSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-7 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <div className="h-7 bg-muted rounded w-20"></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="h-5 bg-muted rounded w-32"></div>
              <div className="h-5 bg-muted rounded w-24"></div>
              <div className="h-5 bg-muted rounded w-28"></div>
            </div>

            <div className="space-y-3 pt-3 border-t">
              <div className="h-5 bg-muted rounded w-40"></div>
              <div className="space-y-3">
                <div className="h-5 bg-muted rounded w-24"></div>
                <div className="pl-4 space-y-2">
                  <div className="h-20 bg-muted/50 rounded"></div>
                  <div className="h-20 bg-muted/50 rounded"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Componente de Erro
const ErrorState = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erro ao carregar horários</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p>
          Não foi possível carregar os horários disponíveis. Isso pode ter
          ocorrido devido a um problema de conexão ou erro no servidor.
        </p>
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </Button>
      </AlertDescription>
    </Alert>
  )
}

// Componente de Lista Vazia
const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <CalendarX2 className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Nenhum horário disponível</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        Não há horários disponíveis para esta disciplina no momento. Entre em
        contato com a coordenação para mais informações.
      </p>
    </div>
  )
}

export const ScheduleSelectionDialog = ({
  codigoGrade,
  subjectName,
}: ScheduleSelectionDialogProps) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState<string | undefined>(undefined)

  const { selectScheduleForSubject, selectedSchedules } = useEnrollment()

  const groupAulasByDay = (aulas: LessonDetail[]) => {
    const grouped: Record<string, LessonDetail[]> = {}
    aulas.forEach((aula) => {
      if (!grouped[aula.designacao]) {
        grouped[aula.designacao] = []
      }
      grouped[aula.designacao].push(aula)
    })
    return grouped
  }

  const { profileData } = useQueryProfile()
  const {
    data: horarios = [],
    isLoading,
    isError,
    refetch,
  } = useQueryCurriculumSchedule(
    {
      academicYear: profileData?.confirmacoes[0]?.ano_lectivo!,
      gradeCurricular: codigoGrade,
      preocidade: profileData?.periodoId!,
    },
    open && !!profileData,
  )

  useEffect(() => {
    if (isError) {
      toast.error('Erro ao carregar horários')
    }
  }, [isError])

  const selectedSchedule = selectedSchedules[codigoGrade]

  const handleSelectHorario = (schedule: Schedule) => {
    selectScheduleForSubject(codigoGrade, {
      codigoHorario: schedule.codigo_horario,
      descHorario: schedule.nome_horario,
    })
    setTitle(schedule.nome_horario)
    setOpen(false)
  }

  const handleRetry = () => {
    refetch()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className="w-full justify-start"
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          {title ? title : 'Selecionar Horário'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Selecionar Horário - {subjectName}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <ScheduleSkeleton />
        ) : isError ? (
          <ErrorState onRetry={handleRetry} />
        ) : horarios.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {horarios.map((horario) => {
              const groupedAulas = groupAulasByDay(horario.detalhes_aulas)
              const isSelectedThis =
                selectedSchedule?.codigoHorario === horario.codigo_horario

              return (
                <Card
                  key={horario.codigo_horario}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelectedThis
                      ? 'border-primary ring-2 ring-primary shadow-sm'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => handleSelectHorario(horario)}
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-xl mb-1">
                          {horario.nome_horario}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {horario.nome_gradecurricular}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Badge
                          variant={
                            horario.periodo_turno === 'Diurno'
                              ? 'default'
                              : 'secondary'
                          }
                          className="text-sm px-3 py-1"
                        >
                          {horario.periodo_turno}
                        </Badge>
                        {isSelectedThis && (
                          <Badge className="bg-primary text-sm px-3 py-1">
                            ✓ Selecionado
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-md">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Capacidade:{' '}
                          <span className="text-primary">
                            {horario.capacidade}
                          </span>
                        </span>
                      </div>
                      <Badge variant="outline" className="px-3 py-2 text-sm">
                        {horario.semestre}
                      </Badge>
                      <Badge
                        variant={
                          horario.status_disponibilidade === 'disponível'
                            ? 'default'
                            : 'destructive'
                        }
                        className="px-3 py-2 text-sm"
                      >
                        {horario.status_disponibilidade}
                      </Badge>
                    </div>

                    {horario.observacao && (
                      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-md p-3">
                        <p className="text-sm text-amber-900 dark:text-amber-200 italic">
                          📌 {horario.observacao}
                        </p>
                      </div>
                    )}

                    <div className="space-y-3 pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        <p className="text-base font-semibold">
                          Horário das Aulas
                        </p>
                      </div>
                      <div className="space-y-4">
                        {Object.entries(groupedAulas).map(([dia, aulas]) => (
                          <div key={dia} className="space-y-2">
                            <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-md">
                              <CalendarDays className="h-4 w-4 text-primary" />
                              <p className="text-sm font-semibold text-primary">
                                {dia}
                              </p>
                            </div>
                            <div className="grid gap-2 pl-2">
                              {aulas
                                .sort((a, b) =>
                                  a.hora_inicio.localeCompare(b.hora_inicio),
                                )
                                .map((aula, index) => (
                                  <div
                                    key={index}
                                    className="flex flex-wrap items-center gap-4 bg-muted/30 hover:bg-muted/50 p-3 rounded-lg border border-transparent hover:border-muted-foreground/20 transition-colors"
                                  >
                                    <div className="flex items-center gap-2 min-w-[140px]">
                                      <Clock className="h-4 w-4 text-primary" />
                                      <span className="text-sm font-medium">
                                        {aula.hora_inicio.slice(0, 5)} -{' '}
                                        {aula.hora_termino.slice(0, 5)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 min-w-[120px]">
                                      <MapPin className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm">
                                        {aula.sala}
                                      </span>
                                    </div>
                                    <Badge
                                      variant="secondary"
                                      className="text-xs font-semibold"
                                    >
                                      {aula.tipo.toUpperCase()}
                                    </Badge>
                                    {aula.docente !== 'n/a' && (
                                      <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                          {aula.docente}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
