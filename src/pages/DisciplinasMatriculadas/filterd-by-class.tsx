import { useState, useMemo, useEffect, useCallback, memo } from 'react'
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
import { Input } from '@/components/ui/input'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'

import { useQueryCurriculumPlan } from '@/hooks/curriculum/use-query-curriculum-plan'
import { useQueryClass } from '@/hooks/class/use-query-class'

import type { ProfileData } from '@/types/profile'
import type { Grade } from '@/types/grade'

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

const DisciplinaCell = memo(({ value }: { value: string }) => (
  <span className="font-medium">{value}</span>
))
DisciplinaCell.displayName = 'DisciplinaCell'

const SemestreCell = memo(({ value }: { value: string }) => (
  <span className="text-muted-foreground">{value}</span>
))
SemestreCell.displayName = 'SemestreCell'

export const FilteredByClass = ({ profileData }: CurrentYearProps) => {
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedSemester, setSelectedSemester] = useState('TODOS')
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [initialized, setInitialized] = useState(false)

  const { data: classData, isLoading: isLoadingClasses } = useQueryClass()

  const anosFiltrados = useMemo(() => {
    if (!classData?.classes) return []

    return classData.classes.filter(
      (item) => Number(item.codigo) <= Number(profileData?.curso_duracao ?? 0),
    )
  }, [classData?.classes, profileData?.curso_duracao])

  /* ========= INICIALIZAR CLASSE (SÓ UMA VEZ) ========= */
  useEffect(() => {
    if (!initialized && anosFiltrados.length > 0) {
      setSelectedClass(anosFiltrados[0].codigo)
      setInitialized(true)
    }
  }, [initialized, anosFiltrados])

  /* ========= LOAD CURRICULUM ========= */
  const shouldFetch = useMemo(() => {
    return Boolean(selectedClass && profileData?.codigo_curso && initialized)
  }, [selectedClass, profileData?.codigo_curso, initialized])

  const {
    data: rawCurriculumPlan = [],
    isLoading: isLoadingCurriculum,
    isError,
  } = useQueryCurriculumPlan(
    {
      class: selectedClass,
      course: profileData?.codigo_curso,
    },
    shouldFetch,
  )

  /* ========= MEMOIZE DATA COM ESTABILIDADE ========= */
  // 🔑 CHAVE: Criar referência estável dos dados
  const curriculumPlan = useMemo(() => {
    if (!Array.isArray(rawCurriculumPlan)) return []
    return rawCurriculumPlan
  }, [rawCurriculumPlan])

  /* ========= MEMOIZED SEMESTERS ========= */
  const semesters = useMemo(() => {
    const unique = new Set(curriculumPlan.map((i) => i.semestre))
    return ['TODOS', ...Array.from(unique).sort()]
  }, [curriculumPlan])

  /* ========= FILTRO POR SEMESTRE (antes do TanStack) ========= */
  const dataFilteredBySemester = useMemo(() => {
    if (selectedSemester === 'TODOS') {
      return curriculumPlan
    }
    return curriculumPlan.filter((i) => i.semestre === selectedSemester)
  }, [curriculumPlan, selectedSemester])

  /* ========= COLUMNS - CRIADAS UMA VEZ E MEMOIZADAS ========= */
  // 🔑 CHAVE: Usar memo e células memoizadas
  const columns = useMemo<ColumnDef<Grade>[]>(
    () => [
      {
        accessorKey: 'disciplina',
        header: 'Disciplina',
        cell: ({ getValue }) => <DisciplinaCell value={getValue() as string} />,
        // Filtro customizado para busca
        filterFn: 'includesString',
      },
      {
        accessorKey: 'semestre',
        header: 'Semestre',
        cell: ({ getValue }) => <SemestreCell value={getValue() as string} />,
        enableSorting: true,
      },
      {
        accessorKey: 'duracaoDisciplina',
        header: 'Duração',
        enableSorting: false,
      },
    ],
    [],
  )

  /* ========= TABLE INSTANCE - COM OTIMIZAÇÕES ========= */
  // 🔑 CHAVE: Não passar funções inline, usar state adequadamente
  const table = useReactTable({
    data: dataFilteredBySemester,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // 🔑 IMPORTANTE: Desabilitar auto-reset
    autoResetPageIndex: false,
    autoResetExpanded: false,
  })

  /* ========= HANDLERS MEMOIZADOS ========= */
  const handleClassChange = useCallback((value: string) => {
    setSelectedClass(value)
    setSelectedSemester('TODOS')
    setGlobalFilter('') // Limpa busca ao trocar de ano
  }, [])

  const handleSemesterChange = useCallback((value: string) => {
    setSelectedSemester(value)
  }, [])

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setGlobalFilter(e.target.value)
    },
    [],
  )

  /* ========= COMPUTED VALUES ========= */
  const selectedAnoNome = useMemo(() => {
    const ano = anosFiltrados.find((a) => a.codigo === selectedClass)
    return ano ? anoPorExtenso(ano.codigo) : ''
  }, [anosFiltrados, selectedClass])

  const isLoading = isLoadingClasses || isLoadingCurriculum

  /* ================= RENDER ================= */

  return (
    <div className="space-y-6 mt-6">
      {/* FILTROS */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedAnoNome
              ? `Disciplinas do ${selectedAnoNome} Ano`
              : 'Disciplinas'}
          </CardTitle>
          <CardDescription>
            Filtre por Ano, Semestre ou Disciplina
          </CardDescription>

          <div className="flex gap-3 flex-wrap mt-3">
            {/* SELECT ANO */}
            <Select
              value={selectedClass}
              onValueChange={handleClassChange}
              disabled={isLoadingClasses || anosFiltrados.length === 0}
            >
              <SelectTrigger type="button" className="w-[160px]">
                <SelectValue placeholder="Selecione o Ano" />
              </SelectTrigger>

              <SelectContent>
                {anosFiltrados.map((ano) => (
                  <SelectItem key={ano.codigo} value={ano.codigo}>
                    {anoPorExtenso(ano.codigo)} Ano
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* SELECT SEMESTRE */}
            <Select
              value={selectedSemester}
              onValueChange={handleSemesterChange}
              disabled={!selectedClass || isLoading}
            >
              <SelectTrigger type="button" className="w-[160px]">
                <SelectValue placeholder="Semestre" />
              </SelectTrigger>

              <SelectContent>
                {semesters.map((semester) => (
                  <SelectItem key={semester} value={semester}>
                    {semester === 'TODOS' ? 'Todos os Semestres' : semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* INPUT BUSCA */}
            <Input
              placeholder="Buscar disciplina..."
              className="w-[220px]"
              value={globalFilter ?? ''}
              onChange={handleSearchChange}
              disabled={!selectedClass || isLoading}
            />
          </div>
        </CardHeader>
      </Card>

      {/* TABELA */}
      <Card className="p-0 overflow-hidden">
        {isError && (
          <CardContent className="py-8 text-center">
            <p className="text-red-500 font-medium">
              Erro ao carregar disciplinas
            </p>
          </CardContent>
        )}

        {isLoading && !isError && (
          <CardContent className="py-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">
                Carregando disciplinas...
              </p>
            </div>
          </CardContent>
        )}

        {!selectedClass && !isLoading && !isError && (
          <CardContent className="py-8 text-center text-muted-foreground">
            Selecione um ano para visualizar as disciplinas
          </CardContent>
        )}

        {!isLoading && !isError && selectedClass && (
          <div className="border rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="border-b bg-muted/50">
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className={`${
                            header.column.id === 'disciplina'
                              ? 'text-left'
                              : 'text-center'
                          } px-4 py-3 text-sm font-semibold`}
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              className={
                                header.column.getCanSort()
                                  ? 'cursor-pointer select-none flex items-center justify-center gap-1'
                                  : ''
                              }
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              {header.column.getCanSort() && (
                                <span className="text-xs">
                                  {{
                                    asc: ' ↑',
                                    desc: ' ↓',
                                  }[header.column.getIsSorted() as string] ??
                                    ' ⇅'}
                                </span>
                              )}
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>

                <tbody>
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="text-center py-10 text-muted-foreground"
                      >
                        {globalFilter
                          ? `Nenhuma disciplina encontrada para "${globalFilter}"`
                          : 'Nenhuma disciplina encontrada'}
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className={`${
                              cell.column.id === 'disciplina'
                                ? 'text-left'
                                : 'text-center'
                            } px-4 py-3`}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
