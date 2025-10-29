'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { ScheduleSelectionDialog } from '../schedule'

type Horario = {
  codigo_horario: string
  nome_horario: string
  capacidade: string
  detalhes_aulas: {
    designacao: string
    tipo: string
    sala: string
    docente: string
    hora_inicio: string
    hora_termino: string
  }[]
}

export type Subject = {
  id: number
  name: string
  code: string
  credits: number
  horarios: Horario[]
}

interface SubjectCardProps {
  subject: Subject
  isNewStudent: boolean
  isSelected: boolean
  selectedScheduleId?: string
  onToggle: (subjectId: number, checked: boolean) => void
  onSelectSchedule: (subjectId: number, scheduleId: string) => void
}

export function SubjectCard({
  subject,
  isNewStudent,
  isSelected,
  selectedScheduleId,
  onToggle,
  onSelectSchedule,
}: SubjectCardProps) {
  return (
    <div key={subject.id} className="rounded-lg border p-4 space-y-4">
      <div className="flex items-start gap-3">
        <Checkbox
          id={`subject-${subject.id}`}
          className="mt-1"
          checked={isSelected}
          onCheckedChange={(checked) =>
            onToggle(subject.id, checked as boolean)
          }
        />

        <div className="flex-1 space-y-3">
          <div>
            <label
              htmlFor={`subject-${subject.id}`}
              className="cursor-pointer font-semibold"
            >
              {subject.name}
            </label>
            <p className="text-sm text-muted-foreground">
              {subject.code} • {subject.credits} créditos
            </p>
          </div>

          {/* === Se for aluno antigo === */}
          {!isNewStudent && (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Selecionar Horário (Obrigatório)
              </p>
              <ScheduleSelectionDialog
                horarios={subject.horarios}
                selectedScheduleId={selectedScheduleId}
                onSelectSchedule={(scheduleId) =>
                  onSelectSchedule(subject.id, scheduleId)
                }
                subjectName={subject.name}
              />
            </div>
          )}

          {/* === Se for aluno novo === */}
          {isNewStudent && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Horários Disponíveis:</p>
              <div className="text-sm text-muted-foreground">
                {subject.horarios.length} horário(s) disponível(is)
              </div>
              <ScheduleSelectionDialog
                horarios={subject.horarios}
                selectedScheduleId={undefined}
                onSelectSchedule={() => {}}
                subjectName={subject.name}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
