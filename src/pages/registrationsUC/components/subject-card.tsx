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

  return (
  <div
  className="rounded-lg border p-4 space-y-4 cursor-pointer transition-colors hover:bg-muted/30"
  onClick={() => toggleSubject(subject)}
>
  <div className="flex items-start gap-3">
    <Checkbox
      id={`subject-${subject.codigoGrade}`}
      className="mt-1"
      checked={selected}
      onCheckedChange={() => toggleSubject(subject)}
      onClick={(e) => e.stopPropagation()}
    />

    <div className="flex-1 space-y-3">
      <div>
        <label
          htmlFor={`subject-${subject.codigoGrade}`}
          className="cursor-pointer font-semibold"
        >
          {subject.disciplina}
        </label>
        <div className="flex justify-between items-center">
          <p className="flex items-center gap-1">
            <span className="font-medium text-sm">Duração:</span>
            {subject.duracaoDisciplina}
          </p>
          <p className="flex items-center gap-1">
            <span className="font-medium text-sm sr-only">Classe:</span>
            {subject.classe}
          </p>
        </div>

        <p className="flex items-center gap-1">
          <span className="font-medium text-sm">
            Valor da inscrição:
          </span>
          {formatCurrency(subject.valorInscricao)}
        </p>
      </div>

      <div
        className="space-y-2"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm font-medium">
          Selecionar Horário (Obrigatório)
        </p>

        <ScheduleSelectionDialog subject={subject} />
      </div>
    </div>
  </div>
</div>
  )
}
