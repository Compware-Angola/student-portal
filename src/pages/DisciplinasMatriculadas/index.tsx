

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { BookOpen, Calendar, Eye } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQueryCurriculumPlan } from '@/hooks/curriculum/use-query-curriculum-plan'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'

interface Disciplina {
  codigo: string
  nome: string
  creditos: number
  ano: number
  semestre: string
  anoLectivo: string
  docente: string
  horario: string
  sala: string
  status: 'em_curso' | 'concluida' | 'reprovada'
  planoEstudo?: {
    objetivos: string[]
    conteudoProgramatico: string[]
    metodologiaAvaliacao: string
    bibliografia: string[]
  }
}

export const DisciplinasMatriculadas = () => {


  const {
    profileData,

  } = useQueryProfile()

  const { data: filteredDisciplinas, isLoading, isError } = useQueryCurriculumPlan({ class: profileData?.confirmacoes?.[0]?.classe ,
    course: profileData?.codigo_curso,})

  // Mock data
  const disciplinas: Disciplina[] = [
    {
      codigo: 'ENGINFO501',
      nome: 'Programação Avançada',
      creditos: 6,
      ano: 3,
      semestre: '1º Semestre',
      anoLectivo: '2024-2025',
      docente: 'Dr. João Silva',
      horario: 'Segunda-Feira 14:00-17:00',
      sala: 'Lab 201',
      status: 'em_curso',
      planoEstudo: {
        objetivos: [
          'Dominar conceitos avançados de programação orientada a objetos',
          'Implementar padrões de design em projetos reais',
          'Desenvolver aplicações escaláveis e mantíveis',
        ],
        conteudoProgramatico: [
          'Revisão de POO e conceitos fundamentais',
          'Padrões de Design (Factory, Singleton, Observer, Strategy)',
          'Arquitetura de Software (MVC, MVVM, Clean Architecture)',
          'Testes Unitários e TDD',
          'Refatoração e Code Review',
          'Boas Práticas e Princípios SOLID',
        ],
        metodologiaAvaliacao:
          'Avaliação Contínua (40%), Projeto Prático (30%), Exame Final (30%)',
        bibliografia: [
          'Design Patterns - Gang of Four',
          'Clean Code - Robert C. Martin',
          'Refactoring - Martin Fowler',
        ],
      },
    },
    {
      codigo: 'ENGINFO502',
      nome: 'Bases de Dados II',
      creditos: 6,
      ano: 3,
      semestre: '1º Semestre',
      anoLectivo: '2024-2025',
      docente: 'Dra. Maria Santos',
      horario: 'Terça-Feira 10:00-13:00',
      sala: 'Sala 305',
      status: 'em_curso',
      planoEstudo: {
        objetivos: [
          'Compreender arquiteturas avançadas de bases de dados',
          'Implementar otimização de consultas complexas',
          'Trabalhar com bases de dados distribuídas',
        ],
        conteudoProgramatico: [
          'Otimização de Queries e Índices',
          'Stored Procedures e Triggers',
          'Transações e Controlo de Concorrência',
          'Bases de Dados Distribuídas',
          'NoSQL e Big Data',
          'Data Warehousing e Business Intelligence',
        ],
        metodologiaAvaliacao:
          'Avaliação Contínua (50%), Projeto (25%), Exame (25%)',
        bibliografia: [
          'Database System Concepts - Silberschatz',
          'NoSQL Distilled - Pramod Sadalage',
          'The Data Warehouse Toolkit - Ralph Kimball',
        ],
      },
    },
    {
      codigo: 'ENGINFO503',
      nome: 'Sistemas Operativos',
      creditos: 5,
      ano: 3,
      semestre: '1º Semestre',
      anoLectivo: '2024-2025',
      docente: 'Dr. Paulo Costa',
      horario: 'Quarta-Feira 15:00-18:00',
      sala: 'Lab 102',
      status: 'em_curso',
      planoEstudo: {
        objetivos: [
          'Compreender a arquitetura interna de sistemas operativos',
          'Dominar gestão de processos e memória',
          'Implementar algoritmos de escalonamento',
        ],
        conteudoProgramatico: [
          'Estrutura de Sistemas Operativos',
          'Processos e Threads',
          'Sincronização e Deadlocks',
          'Gestão de Memória',
          'Sistema de Ficheiros',
          'Segurança e Proteção',
        ],
        metodologiaAvaliacao:
          'Trabalhos Práticos (40%), Exame Parcial (30%), Exame Final (30%)',
        bibliografia: [
          'Operating System Concepts - Silberschatz',
          'Modern Operating Systems - Tanenbaum',
          'Linux Kernel Development - Robert Love',
        ],
      },
    },
    {
      codigo: 'ENGINFO401',
      nome: 'Estruturas de Dados',
      creditos: 6,
      ano: 2,
      semestre: '2º Semestre',
      anoLectivo: '2023-2024',
      docente: 'Dr. Carlos Mendes',
      horario: 'Segunda-Feira 10:00-13:00',
      sala: 'Lab 203',
      status: 'concluida',
    },
    {
      codigo: 'ENGINFO402',
      nome: 'Redes de Computadores',
      creditos: 5,
      ano: 2,
      semestre: '2º Semestre',
      anoLectivo: '2023-2024',
      docente: 'Dra. Ana Rodrigues',
      horario: 'Quinta-Feira 14:00-17:00',
      sala: 'Lab 301',
      status: 'concluida',
    },
  ]



  const disciplinasAnoAtual = disciplinas.filter(
    (d) => d.anoLectivo === '2024-2025',
  )

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
                  <CardTitle>Grade Curricular de  (Nome do Curso)</CardTitle>
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

                    {disciplina && (
                      <PlanoEstudoDialog disciplina={disciplinas.filter((d) => d.codigo === d.codigo)[0]} />
                    )}

                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="atual" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Disciplinas do Ano Letivo 2024-2025</CardTitle>
              <CardDescription>Cadeiras inscritas no ano atual</CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4">
            {disciplinasAnoAtual.map((disciplina) => (
              <Card key={disciplina.codigo}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">
                          {disciplina.nome}
                        </CardTitle>
                      </div>
                      <CardDescription>
                        Código: {disciplina.codigo} | {disciplina.creditos}{' '}
                        Créditos
                      </CardDescription>
                    </div>
                    {getStatusBadge(disciplina.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-semibold mb-1">Horário</p>
                      <p className="text-sm text-muted-foreground">
                        {disciplina.horario}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-1">Sala</p>
                      <p className="text-sm text-muted-foreground">
                        {disciplina.sala}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-1">Docente</p>
                      <p className="text-sm text-muted-foreground">
                        {disciplina.docente}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-1">Semestre</p>
                      <p className="text-sm text-muted-foreground">
                        {disciplina.semestre}
                      </p>
                    </div>
                  </div>
                  {disciplina.planoEstudo && (
                    <PlanoEstudoDialog disciplina={disciplina} />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
