import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { BookOpen, TrendingUp, Award } from 'lucide-react'

interface Grade {
  codigo_disciplina: string
  nome_disciplina: string
  avaliacao_continua: number | null
  p1: number | null
  p2: number | null
  media: number | null
  status: 'Aprovado' | 'Reprovado' | 'Em Curso'
  ano_letivo: string
  semestre: string
}

export function Evaluation() {
  const [selectedYear, setSelectedYear] = useState('2023-2024')
  const [selectedSemester, setSelectedSemester] = useState('all')

  // Mock data - substituir por dados reais da API v1.3/estudante/notas/cadeiras/aluno
  const currentYearGrades: Grade[] = [
    {
      codigo_disciplina: 'GSI-301',
      nome_disciplina: 'Engenharia de Software',
      avaliacao_continua: 14,
      p1: 15,
      p2: null,
      media: 14.5,
      status: 'Em Curso',
      ano_letivo: '2023-2024',
      semestre: '1º Semestre',
    },
    {
      codigo_disciplina: 'GSI-302',
      nome_disciplina: 'Sistemas Distribuídos',
      avaliacao_continua: 13,
      p1: 14,
      p2: 15,
      media: 14,
      status: 'Aprovado',
      ano_letivo: '2023-2024',
      semestre: '1º Semestre',
    },
    {
      codigo_disciplina: 'GSI-303',
      nome_disciplina: 'Inteligência Artificial',
      avaliacao_continua: 15,
      p1: 16,
      p2: null,
      media: 15.5,
      status: 'Em Curso',
      ano_letivo: '2023-2024',
      semestre: '2º Semestre',
    },
  ]

  const allGrades: Grade[] = [
    ...currentYearGrades,
    {
      codigo_disciplina: 'GSI-101',
      nome_disciplina: 'Programação I',
      avaliacao_continua: 12,
      p1: 13,
      p2: 14,
      media: 13,
      status: 'Aprovado',
      ano_letivo: '2022-2023',
      semestre: '1º Semestre',
    },
    {
      codigo_disciplina: 'GSI-102',
      nome_disciplina: 'Matemática Discreta',
      avaliacao_continua: 13,
      p1: 12,
      p2: 14,
      media: 13,
      status: 'Aprovado',
      ano_letivo: '2022-2023',
      semestre: '1º Semestre',
    },
    {
      codigo_disciplina: 'GSI-201',
      nome_disciplina: 'Estruturas de Dados',
      avaliacao_continua: 11,
      p1: 10,
      p2: 12,
      media: 11,
      status: 'Aprovado',
      ano_letivo: '2022-2023',
      semestre: '2º Semestre',
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return <Badge className="bg-green-500">Aprovado</Badge>
      case 'Reprovado':
        return <Badge variant="destructive">Reprovado</Badge>
      case 'Em Curso':
        return <Badge variant="outline">Em Curso</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredGrades = allGrades.filter((grade) => {
    const yearMatch =
      selectedYear === 'all' || grade.ano_letivo === selectedYear
    const semesterMatch =
      selectedSemester === 'all' || grade.semestre === selectedSemester
    return yearMatch && semesterMatch
  })

  const calculateAverage = (grades: Grade[]) => {
    const validGrades = grades.filter((g) => g.media !== null)
    if (validGrades.length === 0) return 0
    const sum = validGrades.reduce((acc, g) => acc + (g.media || 0), 0)
    return (sum / validGrades.length).toFixed(2)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Avaliações</h1>
        <p className="text-muted-foreground mt-2">
          Consulte suas notas e acompanhe seu desempenho acadêmico
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateAverage(allGrades)}
            </div>
            <p className="text-xs text-muted-foreground">
              Todas as disciplinas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Atual</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateAverage(currentYearGrades)}
            </div>
            <p className="text-xs text-muted-foreground">
              Ano letivo {selectedYear}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disciplinas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allGrades.length}</div>
            <p className="text-xs text-muted-foreground">Total cursadas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Ano Atual</TabsTrigger>
          <TabsTrigger value="all">Todas as Notas</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notas do Ano Letivo Atual</CardTitle>
              <CardDescription>
                Visualize suas avaliações contínuas, P1, P2 e médias do ano
                letivo {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead className="text-center">
                      Aval. Contínua
                    </TableHead>
                    <TableHead className="text-center">P1</TableHead>
                    <TableHead className="text-center">P2</TableHead>
                    <TableHead className="text-center">Média</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentYearGrades.map((grade) => (
                    <TableRow key={grade.codigo_disciplina}>
                      <TableCell className="font-medium">
                        {grade.codigo_disciplina}
                      </TableCell>
                      <TableCell>{grade.nome_disciplina}</TableCell>
                      <TableCell className="text-center">
                        {grade.avaliacao_continua ?? '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        {grade.p1 ?? '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        {grade.p2 ?? '-'}
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {grade.media ?? '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(grade.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Todas as Notas</CardTitle>
              <CardDescription>
                Histórico completo de todas as disciplinas cursadas
              </CardDescription>
              <div className="flex gap-4 mt-4">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Ano Letivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Anos</SelectItem>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                    <SelectItem value="2022-2023">2022-2023</SelectItem>
                    <SelectItem value="2021-2022">2021-2022</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedSemester}
                  onValueChange={setSelectedSemester}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Semestre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Semestres</SelectItem>
                    <SelectItem value="1º Semestre">1º Semestre</SelectItem>
                    <SelectItem value="2º Semestre">2º Semestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Ano Letivo</TableHead>
                    <TableHead>Semestre</TableHead>
                    <TableHead className="text-center">Média</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGrades.map((grade) => (
                    <TableRow
                      key={`${grade.codigo_disciplina}-${grade.ano_letivo}-${grade.semestre}`}
                    >
                      <TableCell className="font-medium">
                        {grade.codigo_disciplina}
                      </TableCell>
                      <TableCell>{grade.nome_disciplina}</TableCell>
                      <TableCell>{grade.ano_letivo}</TableCell>
                      <TableCell>{grade.semestre}</TableCell>
                      <TableCell className="text-center font-semibold">
                        {grade.media ?? '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(grade.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
