import { formatCurrency } from '@/utils'
import type { Grade } from '@/types/grade'
import { Checkbox } from '@/components/ui/checkbox'



import { cn } from '@/lib/utils'
type SubjectCardProps = {
  state?: 'enrollment' | 'registrationUC'
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
    <div className="rounded-lg border p-4 space-y-4">
      <div className="flex items-start gap-3">
        <Checkbox className="mt-1" checked={selected} />

        <div className="flex-1 space-y-3">
          <div>
            <button
              disabled={true}
              onClick={() => toggleSubject(subject)}
              className={cn(
                'font-semibold',
                  'cursor-not-allowed '
                
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

        
        </div>
      </div>
    </div>
  )
}
