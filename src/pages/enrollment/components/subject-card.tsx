import { formatCurrency } from '@/utils'
import type { Grade } from '@/types/grade'
import { Checkbox } from '@/components/ui/checkbox'

import { ScheduleSelectionDialog } from '../schedule'
import { useEnrollment } from '../hooks/use-enrollment'
import { cn } from '@/lib/utils'
type SubjectCardProps = {
  state?: 'enrollment' | 'registrationUC'
  subject: Grade
  isSelected: (subject: Grade) => boolean
  toggleSubject: (subject: Grade) => void
}

export function SubjectCard({
  state = 'enrollment',
  subject,
  isSelected,
  toggleSubject,
}: SubjectCardProps) {
  const selected = isSelected(subject)
  const { isNewStudentWithOutEnrollment } = useEnrollment()

  return (
    <div className="rounded-lg border p-4 space-y-4">
      <div className="flex items-start gap-3">
        <Checkbox className="mt-1" checked={selected} />

        <div className="flex-1 space-y-3">
          <div>
            <button
              disabled={state === 'enrollment'}
              onClick={() => toggleSubject(subject)}
              className={cn(
                'font-semibold',
                state === 'enrollment'
                  ? 'cursor-not-allowed '
                  : 'cursor-pointer',
              )}
            >
              {subject.disciplina}
            </button>
            <p className="flex items-center gap-1">
              <span className="font-medium text-sm">Duração:</span>
              {subject.duracaoDisciplina}
            </p>
            <p className="flex items-center gap-1">
              <span className="font-medium text-sm">Valor da inscrição:</span>
              {formatCurrency(subject.valorInscricao)}
            </p>
          </div>

          {!isNewStudentWithOutEnrollment && (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Selecionar Horário (Obrigatório)
              </p>
              <ScheduleSelectionDialog subject={subject} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
