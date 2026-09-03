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
  CalendarDays,
  AlertCircle,
  RefreshCw,
  CalendarX2,
  Check,
  CheckCircle2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useEffect, useState } from 'react'

import { toast } from 'sonner'
import type { Grade } from '@/types/grade'
import { useQueryCurrentAcademicYear } from '@/hooks/academic-year/use-query-current-academic-year'
import { useSchedulesByPeriod } from '@/hooks/schedule/use-get-schedules-by-period'
import type { ScheduleByPeriodDto } from '@/services/schedule/get-schedules-by-period.service'
import { useRegistrationsUC } from './hooks/use-registrations-uc'

interface ScheduleSelectionDialogProps {
  subject: Grade
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
  subject,
}: ScheduleSelectionDialogProps) => {
  const [open, setOpen] = useState(false)

  const { selectScheduleForSubject, selectedSchedules } = useRegistrationsUC()

  const groupAulasByDay = (aulas: ScheduleByPeriodDto['aulas']) => {
    const grouped: Record<string, ScheduleByPeriodDto['aulas']> = {}

    aulas.forEach((aula) => {
      if (!grouped[aula.diaSemana]) {
        grouped[aula.diaSemana] = []
      }
      grouped[aula.diaSemana].push(aula)
    })

    return grouped
  }

  const { profileData, isLoading: isLoadingProfile } = useQueryProfile()
  const { data: currentAcademicYear, isLoading: isLoadingAcademicYear } =
    useQueryCurrentAcademicYear(profileData?.codigo_tipo_candidatura)

  const {
    data: horarios = [],
    isLoading: isLoadingSchedules,
    isError,
    refetch,
  } = useSchedulesByPeriod({
    anoLectivo: currentAcademicYear?.codigo
      ? Number(currentAcademicYear?.codigo)
      : undefined,

    gradeCurricular: subject?.codigoGrade
      ? Number(subject?.codigoGrade)
      : undefined,
    // periodo: profileData?.periodoid ? Number(profileData.periodoid) : undefined,
  })

  useEffect(() => {
    if (isError) {
      toast.error('Erro ao carregar horários')
    }
  }, [isError])

  const selectedSchedule = selectedSchedules[subject.codigoGrade]

  const handleSelectHorario = (schedule: ScheduleByPeriodDto) => {
    // O provider trata de garantir que a disciplina fica selecionada.
    selectScheduleForSubject(subject.codigoGrade, {
      codigoHorario: schedule.codigo.toString(),
      descHorario: schedule.designacao,
    })
    setOpen(false)
  }

  const handleRetry = () => {
    refetch()
  }
  const isLoading =
    isLoadingSchedules || isLoadingAcademicYear || isLoadingProfile
  const hasSelectedSchedule = Boolean(selectedSchedule?.codigoHorario)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className={`w-full justify-start ${
            hasSelectedSchedule
              ? 'border-green-500 bg-green-50 text-green-800 hover:bg-green-100 hover:text-green-900 dark:border-green-600 dark:bg-green-950/40 dark:text-green-300'
              : ''
          }`}
        >
          {hasSelectedSchedule ? (
            <CheckCircle2 className="mr-2 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
          ) : (
            <CalendarDays className="mr-2 h-4 w-4 shrink-0" />
          )}
          <span className="truncate">
            {hasSelectedSchedule
              ? `Horário: ${selectedSchedule?.descHorario}`
              : 'Selecionar Horário'}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl w-full max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Selecionar Horário - {subject.disciplina}
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
              const groupedAulas = groupAulasByDay(horario.aulas)
              const isSelectedThis =
                selectedSchedule?.codigoHorario === horario.codigo.toString()
              return (
                <Card
                  key={horario.codigo}
                  aria-pressed={isSelectedThis}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelectedThis
                      ? 'border-green-500 ring-2 ring-green-500 shadow-sm dark:border-green-600 dark:ring-green-600'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => handleSelectHorario(horario)}
                >
                  <CardContent className="p-6 space-y-4">
                    {/* Cabeçalho */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-xl">
                            {horario.designacao}
                          </h3>
                          {isSelectedThis && (
                            <Badge className="gap-1 bg-green-600 text-white hover:bg-green-600">
                              <Check className="h-3.5 w-3.5" />
                              Selecionado
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {horario.disciplina}
                        </p>
                      </div>
                      <Badge className="text-sm px-3 py-1">
                        {horario.disponibilidade}
                      </Badge>
                    </div>

                    {/* Infos */}
                    <div className="flex flex-wrap gap-3">
                     

                      <Badge variant="outline" className="px-3 py-2 text-sm">
                        {horario.anoLectivo}
                      </Badge>
                    </div>

                    {/* {horario?.observacao && (
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                        <p className="text-sm italic">
                          📌 {horario?.observacao}
                        </p>
                      </div>
                    )} */}

                    {/* Aulas */}
                    <div className="space-y-3 pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        <p className="text-base font-semibold">
                          Horário das Aulas
                        </p>
                      </div>

                      {Object.keys(groupedAulas).length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">
                          Nenhuma aula definida
                        </p>
                      ) : (
                        Object.entries(groupedAulas).map(([dia, aulas]) => (
                          <div key={dia} className="space-y-2">
                            <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-md">
                              <CalendarDays className="h-4 w-4 text-primary" />
                              <p className="text-sm font-semibold text-primary">
                                {dia}
                              </p>
                            </div>

                            <div className="grid gap-2 pl-2">
                              {aulas.map((aula, index) => (
                                <div
                                  key={index}
                                  className="flex flex-wrap items-center gap-4 bg-muted/30 p-3 rounded-lg"
                                >
                                  <div className="flex items-center gap-2 min-w-[160px]">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium">
                                      {aula.horaInicio && aula.horaTermino
                                        ? `${aula.horaInicio} - ${aula.horaTermino}`
                                        : 'Horário por definir'}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 min-w-[120px]">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{aula.sala}</span>
                                  </div>

                                  <Badge
                                    variant="secondary"
                                    className="text-xs font-semibold"
                                  >
                                    {aula.tipoAula}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
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
