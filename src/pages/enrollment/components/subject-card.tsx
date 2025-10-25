import { CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils'
import { Card } from '@/components/ui/card'
import type { NewStudentCurriculumSubject } from '@/services/curriculum/new-student-curriculum-plan.service'

type SubjectCardProps = {
  subject: NewStudentCurriculumSubject
  isSelected: (subject: NewStudentCurriculumSubject) => boolean
  toggleSubject: (subject: NewStudentCurriculumSubject) => void
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

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => toggleSubject(subject)}
      onKeyDown={handleKeyPress}
      className={cn(
        'group  gap-2 p-4 transition-all duration-200 cursor-pointer select-none outline-none',
        'hover:shadow-sm hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/40',
        selected && 'border-primary/70 bg-primary/5',
      )}
      aria-pressed={selected}
    >
      <div className="flex items-center justify-between">
        <h3
          className={cn(
            'font-semibold text-lg  transition-colors duration-200',
            'group-hover:text-primary',
            selected && 'text-primary',
          )}
        >
          {subject.disciplina}
        </h3>

        <span
          className="pointer-events-none transition-colors duration-200"
          aria-hidden="true"
        >
          {selected ? (
            <CheckCircle2 className="text-primary" />
          ) : (
            <Circle className="group-hover:text-primary" />
          )}
        </span>
      </div>

      <div
        className={cn(
          'mt-2 flex flex-wrap gap-3 text-sm transition-colors duration-200',
          '',
        )}
      >
        <span className="flex items-center gap-1">
          <span className="font-medium">Duração:</span>
          {subject.duracaoDisciplina}
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <span className="font-medium">Valor da inscrição:</span>
          {formatCurrency(subject.valorInscricao)}
        </span>
      </div>
    </Card>
  )
}
