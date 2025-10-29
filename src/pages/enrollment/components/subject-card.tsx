import { formatCurrency } from '@/utils'
import type { Grade } from '@/types/grade'
import { Checkbox } from '@/components/ui/checkbox'

import { ScheduleSelectionDialog } from '../schedule'
type SubjectCardProps = {
  subject: Grade
  isSelected: (subject: Grade) => boolean
  toggleSubject: (subject: Grade) => void
}

export function SubjectCard({
  subject,
  isSelected,
  toggleSubject,
}: SubjectCardProps) {
  const selected = isSelected(subject)

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleSubject(subject)
    }
  }
  const isNewStudent = false

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => toggleSubject(subject)}
      onKeyDown={handleKeyPress}
      className="rounded-lg border p-4 space-y-4 cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <Checkbox className="mt-1" checked={selected} />

        <div className="flex-1 space-y-3">
          <div>
            <label
              htmlFor={`subject-${subject.codigoGrade}`}
              className="cursor-pointer font-semibold"
            >
              {subject.disciplina}
            </label>
            <p className="flex items-center gap-1">
              <span className="font-medium text-sm">Duração:</span>
              {subject.duracaoDisciplina}
            </p>
            <p className="flex items-center gap-1">
              <span className="font-medium text-sm">Valor da inscrição:</span>
              {formatCurrency(subject.valorInscricao)}
            </p>
          </div>

          {!isNewStudent && (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Selecionar Horário (Obrigatório)
              </p>
              <ScheduleSelectionDialog
                codigoGrade={subject.codigoGrade}
                selectedScheduleId={undefined}
                subjectName={subject.disciplina}
              />
            </div>
          )}

          {isNewStudent && (
            <div className="space-y-2">
              <ScheduleSelectionDialog
                codigoGrade={subject.codigoGrade}
                selectedScheduleId={undefined}
                subjectName={subject.disciplina}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
