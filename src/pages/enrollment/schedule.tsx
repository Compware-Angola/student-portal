import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, User, CalendarDays } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { LessonDetail } from '@/types/schedule'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useQueryCurriculumSchedule } from '@/hooks/curriculum/use-query-curriculum-schedule'
import { useState } from 'react'
import { useEnrollment } from './hooks/use-enrollment'

interface ScheduleSelectionDialogProps {
  subjectName: string
  codigoGrade: string
}

export const ScheduleSelectionDialog = ({
  codigoGrade,
  subjectName,
}: ScheduleSelectionDialogProps) => {
  const [open, setOpen] = useState(false)

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
  const { data: horarios = [] } = useQueryCurriculumSchedule(
    {
      academicYear: profileData?.confirmacoes[0]?.ano_lectivo!,
      gradeCurricular: codigoGrade,
      preocidade: profileData?.periodoId!,
    },
    open && !!profileData, // busca só quando modal aberto
  )

  const selectedSchedule = selectedSchedules[codigoGrade]

  const handleSelectHorario = (horario: any) => {
    selectScheduleForSubject(codigoGrade, {
      codigoHorario: horario.codigo_horario,
      descHorario: horario.nome_horario,
    })
    setOpen(false)
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
          Selecionar Horário
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Selecionar Horário - {subjectName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {horarios.map((horario) => {
            const groupedAulas = groupAulasByDay(horario.detalhes_aulas)
            const isSelectedThis =
              selectedSchedule?.codigoHorario === horario.codigo_horario

            return (
              <Card
                key={horario.codigo_horario}
                className={`cursor-pointer transition-all ${
                  isSelectedThis
                    ? 'border-primary ring-2 ring-primary'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => handleSelectHorario(horario)}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
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
                      >
                        {horario.periodo_turno}
                      </Badge>
                      {isSelectedThis && (
                        <Badge className="bg-primary">Selecionado</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Capacidade: {horario.capacidade}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline">{horario.semestre}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge
                        variant={
                          horario.status_disponibilidade === 'disponível'
                            ? 'default'
                            : 'destructive'
                        }
                      >
                        {horario.status_disponibilidade}
                      </Badge>
                    </div>
                  </div>

                  {horario.observacao && (
                    <p className="text-sm text-muted-foreground italic">
                      {horario.observacao}
                    </p>
                  )}

                  <div className="space-y-2 pt-2 border-t">
                    <p className="text-sm font-medium">Horário das Aulas:</p>
                    {Object.entries(groupedAulas).map(([dia, aulas]) => (
                      <div key={dia} className="space-y-1">
                        <p className="text-sm font-medium text-primary">
                          {dia}
                        </p>
                        <div className="grid gap-2 pl-4">
                          {aulas
                            .sort((a, b) =>
                              a.hora_inicio.localeCompare(b.hora_inicio),
                            )
                            .map((aula, index) => (
                              <div
                                key={index}
                                className="flex flex-wrap gap-3 text-sm bg-muted/50 p-2 rounded"
                              >
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span>
                                    {aula.hora_inicio.slice(0, 5)} -{' '}
                                    {aula.hora_termino.slice(0, 5)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3 text-muted-foreground" />
                                  <span>{aula.sala}</span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {aula.tipo.toUpperCase()}
                                </Badge>
                                {aula.docente !== 'n/a' && (
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3 text-muted-foreground" />
                                    <span>{aula.docente}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
