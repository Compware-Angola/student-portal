import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Grade } from '@/types/grade'
import { formatCurrency } from '@/utils'

export function SubjectItem({
  subject,
  onRemove,
  disabled,
}: {
  subject: Grade
  disabled: boolean
  onRemove: (codigoGrade: string) => void
}) {
  return (
    <li className="flex items-center justify-between gap-4 border-b py-5">
      <div className="flex flex-col gap-2">
        <span className="font-medium">{subject.disciplina}</span>

        <Badge
          variant={
            subject.duracaoDisciplina === 'Anual' ? 'secondary' : 'default'
          }
          className="text-xs"
        >
          {subject.duracaoDisciplina}
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-medium">
          {formatCurrency(Number(subject.valorInscricao))}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onRemove(subject.codigoGrade)}
        >
          Remover
        </Button>
      </div>
    </li>
  )
}
