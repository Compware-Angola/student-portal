import { Badge } from '@/components/ui/badge'
import { Calendar, GraduationCap } from 'lucide-react'
type ProfileInfoProps = {
  nomeCompleto: string
  curso: string
  matricula: string
  anoAcademico: string
}

export function ProfileInfo(props: ProfileInfoProps) {
  const { nomeCompleto, curso, matricula, anoAcademico } = props
  return (
    <div className="flex-1 text-center md:text-left">
      <h1 className="text-3xl mb-2">{nomeCompleto}</h1>
      <p className="mb-1">Estudante de {curso}</p>
      <p className="text-accent-foreground text-sm font-mono mb-4">
        Matrícula: {matricula}
      </p>

      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
        <Badge>
          <GraduationCap className="w-3 h-3 mr-1" />
          {curso}
        </Badge>
        <Badge variant="secondary">
          <Calendar className="w-3 h-3 mr-1" />
          {anoAcademico}
        </Badge>
      </div>
    </div>
  )
}
