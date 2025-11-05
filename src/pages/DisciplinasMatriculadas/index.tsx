

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { BookOpen, Calendar } from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQueryCurriculumPlan } from '@/hooks/curriculum/use-query-curriculum-plan'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useQueryCurrentCurriculumPlanSudent } from '@/hooks/curriculum/use-query-current-curriculum-plan-student'
import { useQueryCurrentAcademicYear } from '@/hooks/academic-year/use-query-current-academic-year'


export const DisciplinasMatriculadas = () => {

const {data: academicYearData}=useQueryCurrentAcademicYear()
  const {
    profileData,

  } = useQueryProfile()

  const { data: filteredDisciplinas, isLoading, isError } = useQueryCurriculumPlan({ class: profileData?.confirmacoes?.[0]?.classe ,
    course: profileData?.codigo_curso,},true)
  const {
    data: studentCurriculumPlanData,
  
  } = useQueryCurrentCurriculumPlanSudent({
    academicYearCode: academicYearData?.codigo,
    preEnrollmentCode:profileData?.preEnrollmentCode,
  })



  const getStatusBadge = (status: string) => {
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
{/*
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
 */}
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Disciplinas Matriculadas</CardTitle>
        </CardHeader>
        <CardContent>Carregando disciplinas...</CardContent>
      </Card>
    )
  }
  if(isError){
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

      <Tabs defaultValue="grade" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grade">Grade Curricular</TabsTrigger>
          <TabsTrigger value="atual">Ano Atual</TabsTrigger>
        </TabsList>

        <TabsContent value="grade" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <CardTitle>Grade Curricular de  {profileData?.curso}</CardTitle>
                  <br />
               <p>  <CardDescription> Cadeiras Pertecentes à sua grade curricular</CardDescription></p>

                </div>

              </div>
            </CardHeader>
          </Card>

          <div className="grid gap-4">
            {filteredDisciplinas.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">
                    Nenhuma disciplina encontrada com os filtros selecionados
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredDisciplinas.map((disciplina) => (
                <Card key={disciplina.codigoDisciplina}>
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
                        <p>  Código: {disciplina.codigoDisciplina} </p>
                           {profileData?.course} | {profileData?.confirmacoes?.[0]?.classe} º Ano
                        </CardDescription>
                      </div>

                       {getStatusBadge('em_curso')}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{disciplina.semestre}</span>
                      </div>
                      {/*
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{disciplina.horario}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Docente: {disciplina.docente}
                        </span>
                      </div>
                       */}
                    </div>
                 {/*
                    {disciplina && (
                      <PlanoEstudoDialog disciplina={disciplinas.filter((d) => d.codigo === d.codigo)[0]} />
                    )}
                       */}

                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="atual" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Disciplinas do Ano Letivo {academicYearData?.designacao}</CardTitle>
              <CardDescription>Cadeiras inscritas no ano atual</CardDescription>
            </CardHeader>
          </Card>

<div className="grid gap-4">
  {studentCurriculumPlanData.length > 0 ? (
    studentCurriculumPlanData.map((disciplina) => (
      <Card key={disciplina.CodigoDisciplina}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{disciplina.disciplina}</CardTitle>
              </div>
              <CardDescription>
                Código: {disciplina.CodigoGrade} | Créditos: {disciplina.estado}
              </CardDescription>
            </div>
            {getStatusBadge('em_curso')}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-semibold mb-1">Semestre</p>
              <p className="text-sm text-muted-foreground">{disciplina.semestre}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    ))
  ) : (
    // CARD VAZIO — NENHUMA DISCIPLINA
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-muted/50 border-2 border-dashed rounded-full p-4 mb-4">
          <BookOpen className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Nenhuma disciplina cadastrada
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Não há disciplinas no seu plano de estudos no momento. Entre em contato com a secretaria acadêmica se achar que isso é um erro.
        </p>
      </CardContent>
    </Card>
  )}
</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
