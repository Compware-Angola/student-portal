import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { BookOpen, Calendar } from 'lucide-react'
import { useQueryCurriculumPlanCurrentYear } from '@/hooks/curriculum/use-query-curriculum-plan'
import { useQueryCurrentAcademicYear } from '@/hooks/academic-year/use-query-current-academic-year'
import type { ProfileData } from '@/types/profile'
import { StatusBadge } from './status-badge'
type CurrentYearProps = {
  profileData?: ProfileData
}
export const CurrentYear = ({ profileData }: CurrentYearProps) => {
  const { data: academicYear } = useQueryCurrentAcademicYear()
  const {
    data: current = [],
    isLoading,
    isError,
  } = useQueryCurriculumPlanCurrentYear(
    {
      class: profileData?.confirmacoes?.[0]?.classe,
      course: profileData?.codigo_curso,
    },
    true,
  )

  if (isLoading) {
    return <p>Carregando disciplinas...</p>
  }

  if (isError) {
    return <p>Erro ao carregar disciplinas do ano atual.</p>
  }

  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Disciplinas do Ano Letivo {academicYear?.designacao}
          </CardTitle>
          <CardDescription>
            Cadeiras pertencentes à sua grade curricular
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {current.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                Nenhuma disciplina encontrada com os filtros selecionados.
              </p>
            </CardContent>
          </Card>
        ) : (
          current.map((disciplina, index) => (
            <Card
              key={`${disciplina.codigoDisciplina}-index-${index}-${current.length - index}-current`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">
                        {disciplina.disciplina}
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Código: {disciplina.codigoDisciplina} |{' '}
                      {profileData?.confirmacoes?.[0]?.classe}º Ano
                    </CardDescription>
                  </div>
                  <StatusBadge status={'em_curso'} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{disciplina.semestre}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
