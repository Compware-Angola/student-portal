import { Badge } from '@/components/ui/badge'

import type { Grade } from '@/types/grade'
import { formatCurrency } from '@/utils'

export function SubjectItem({
  subject,
  tipoCandidatura="Linceciatura"


}: {
  subject: Grade
  tipoCandidatura?: "Linceciatura" | "Pos-Graduacao"

}) {
  console.table(subject)
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
        {tipoCandidatura ==="Linceciatura" &&   <div className="flex items-center gap-3">
        <span className="font-medium">
          {formatCurrency(Number(subject.valorInscricao))}
        </span>

       
      </div>}
    
    </li>
  )
}
