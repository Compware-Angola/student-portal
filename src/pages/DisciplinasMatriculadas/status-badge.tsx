import { Badge } from '@/components/ui/badge'
type StatusBadgeProps = {
  status: string
}
export const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case 'em_curso':
      return <Badge variant="default">Em Curso</Badge>
    case 'concluida':
      return <Badge variant="secondary">Concluída</Badge>
    case 'reprovada':
      return <Badge variant="destructive">Reprovada</Badge>
    default:
      return <Badge>Desconhecido</Badge>
  }
}
