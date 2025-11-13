import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQueryCurriculumPlan } from '@/hooks/curriculum/use-query-curriculum-plan'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'

import { CurrentYear } from './current-year'
import { FilteredByClass } from './filterd-by-class'
import { Spinner } from '@/components/ui/spinner'

export const DisciplinasMatriculadas = () => {
  const {
    profileData,
    isLoading: isLoandingProfileData,
    isError: errorProfileData,
  } = useQueryProfile()

  const { isLoading, isError } = useQueryCurriculumPlan(
    {
      class: profileData?.confirmacoes?.[0]?.classe,
      course: profileData?.codigo_curso,
    },
    true,
  )

  {
    /*
  const PlanoEstudoDialog = ({ disciplina }: { disciplina: Disciplina }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          Ver Plano de Estudo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{disciplina.nome}</DialogTitle>
          <DialogDescription>Código: {disciplina.codigo}</DialogDescription>
        </DialogHeader>

        {disciplina.planoEstudo ? (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">
                Objetivos da Disciplina
              </h3>
              <ul className="list-disc list-inside space-y-2">
                {disciplina.planoEstudo.objetivos.map((obj, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">
                    {obj}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">
                Conteúdo Programático
              </h3>
              <ol className="list-decimal list-inside space-y-2">
                {disciplina.planoEstudo.conteudoProgramatico.map(
                  (conteudo, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">
                      {conteudo}
                    </li>
                  ),
                )}
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">
                Metodologia de Avaliação
              </h3>
              <p className="text-sm text-muted-foreground">
                {disciplina.planoEstudo.metodologiaAvaliacao}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">
                Bibliografia Recomendada
              </h3>
              <ul className="list-disc list-inside space-y-2">
                {disciplina.planoEstudo.bibliografia.map((livro, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">
                    {livro}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm font-semibold">Docente</p>
                <p className="text-sm text-muted-foreground">
                  {disciplina.docente}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold">Créditos</p>
                <p className="text-sm text-muted-foreground">
                  {disciplina.creditos} ECTS
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold">Horário</p>
                <p className="text-sm text-muted-foreground">
                  {disciplina.horario}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold">Sala</p>
                <p className="text-sm text-muted-foreground">
                  {disciplina.sala}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Plano de estudo não disponível
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
 */
  }
  if (isLoading || isLoandingProfileData) {
    return <Spinner className="mx-auto my-8" />
  }
  if (isError || errorProfileData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro ao pegar a Grade</CardTitle>
        </CardHeader>
        <CardContent>Ops !</CardContent>
      </Card>
    )
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Disciplinas Matriculadas</h1>
        <p className="text-muted-foreground mt-2">
          Consulte as suas disciplinas e planos de estudo
        </p>
      </div>

      <Tabs defaultValue="atual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="atual">Ano Atual</TabsTrigger>
          <TabsTrigger value="grade">Grade Curricular</TabsTrigger>
        </TabsList>

        <TabsContent value="atual" className="space-y-6 mt-6">
          <CurrentYear profileData={profileData ?? undefined} />
        </TabsContent>
        <FilteredByClass profileData={profileData ?? undefined} />
        <TabsContent value="grade" className="space-y-6 mt-6"></TabsContent>
      </Tabs>
    </div>
  )
}
