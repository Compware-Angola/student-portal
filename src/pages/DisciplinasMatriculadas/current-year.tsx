import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BookOpen, Calendar, AlertCircle } from 'lucide-react'
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

  // Verifica se o aluno está inscrito no ano letivo atual
  const isConfirmed =
    profileData?.confirmacoes?.[0]?.ano_lectivo === academicYear?.codigo

  // Carregando
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Carregando disciplinas...</p>
        </CardContent>
      </Card>
    )
  }

  // Erro
  if (isError) {
    return (
      <Card className="border-destructive/20">
        <CardContent className="py-8 text-center">
          <p className="text-destructive">
            Erro ao carregar disciplinas do ano atual.
          </p>
        </CardContent>
      </Card>
    )
  }

  // NÃO ESTÁ INSCRITO NO ANO LETIVO
  if (!isConfirmed) {
    return (
      <div className="space-y-6 mt-6">
        <Card className="border-warning/20 bg-warning/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-warning" />
              <CardTitle className="text-lg">
                Ainda não está inscrito no ano letivo
              </CardTitle>
            </div>
            <CardDescription>
              Ano letivo atual: <strong>{academicYear?.designacao}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Para visualizar as disciplinas, é necessário confirmar a sua
              inscrição no ano letivo atual.
              <br />
              Vá até a área de <strong>Matrículas</strong> ou contacte a
              secretaria.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ESTÁ INSCRITO → MOSTRA DISCIPLINAS
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
