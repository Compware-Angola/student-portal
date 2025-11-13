import { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { BookOpen, Calendar } from 'lucide-react'

import { useQueryCurriculumPlan } from '@/hooks/curriculum/use-query-curriculum-plan'
import { useQueryClass } from '@/hooks/class/use-query-class'
import { StatusBadge } from './status-badge'
import type { ProfileData } from '@/types/profile'

// Função para converter número do ano em texto legível
const anoPorExtenso = (codigo: string | number): string => {
  const mapa: Record<string, string> = {
    '1': 'Primeiro',
    '2': 'Segundo',
    '3': 'Terceiro',
    '4': 'Quarto',
    '5': 'Quinto',
  }
  return mapa[String(codigo)] ?? `${codigo}º`
}

type CurrentYearProps = {
  profileData?: ProfileData
}

export const FilteredByClass = ({ profileData }: CurrentYearProps) => {
  const { data: classData, isLoading: isLoadingClass } = useQueryClass()

  // 🔹 Filtra anos de acordo com a duração do curso
  const anosFiltrados =
    classData?.classes.filter(
      (item) => Number(item.codigo) <= Number(profileData?.curso_duracao ?? 0),
    ) ?? []

  // 🔹 Seleciona o primeiro ano por padrão
  const [selectedClass, setSelectedClass] = useState<string | undefined>(
    anosFiltrados[0]?.codigo,
  )

  // 🔹 Recupera o texto correspondente ao ano selecionado
  const selectedAnoNome = useMemo(() => {
    const ano = anosFiltrados.find((a) => a.codigo === selectedClass)
    return ano ? anoPorExtenso(ano.codigo) : ''
  }, [anosFiltrados, selectedClass])

  // 🔹 Query de disciplinas por turma e curso
  const {
    isLoading,
    isError,
    data: curriculumPlan = [],
  } = useQueryCurriculumPlan(
    {
      class: selectedClass,
      course: profileData?.codigo_curso,
    },
    true,
  )

  if (isLoading || isLoadingClass) return <p>Carregando disciplinas...</p>
  if (isError) return <p>Erro ao carregar disciplinas.</p>

  return (
    <div className="space-y-6 mt-6">
      {/* Cabeçalho com filtro */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <CardTitle>Disciplinas do {selectedAnoNome} Ano</CardTitle>
              <CardDescription>
                Cadeiras pertencentes à sua grade curricular
              </CardDescription>
            </div>

            {/* Filtro de seleção de ano */}
            <div className="min-w-[150px]">
              <Select
                value={selectedClass}
                onValueChange={(value) => setSelectedClass(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  {anosFiltrados.map((ano) => (
                    <SelectItem key={ano.codigo} value={ano.codigo}>
                      {anoPorExtenso(ano.codigo)} Ano
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Lista de disciplinas */}
      <div className="grid gap-4">
        {curriculumPlan.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                Nenhuma disciplina encontrada para o {selectedAnoNome} ano.
              </p>
            </CardContent>
          </Card>
        ) : (
          curriculumPlan.map((disciplina, index) => (
            <Card key={`${disciplina.codigoDisciplina}-${index}`}>
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
                      Código: {disciplina.codigoDisciplina} | {selectedAnoNome}{' '}
                      Ano
                    </CardDescription>
                  </div>
                  <StatusBadge status="em_curso" />
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
