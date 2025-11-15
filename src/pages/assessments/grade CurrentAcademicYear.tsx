import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { useQueryStudentAssessmentsByCurrentAcademicYear } from '@/hooks/assessments/use-query-student-assessments-by-current-academic-year'
import type { StudentAssessment } from '@/services/assessments/student-assessments-by-current-academic-year.service'
import React from 'react'

type Avaliacao = {
  id: string
  tipo: string
  designacao: string
  nota: number
  data: string
  subRows?: []
}

type DisciplinaResumo = {
  disciplina_id: string
  disciplina_nome: string
  disciplina_sigla: string
  classe_id: string
  semestre_id: string
  media_final: string
  avaliacoes: Avaliacao[]
  subRows?: Avaliacao[]
}

function agruparAvaliacoesPorDisciplina(
  data: StudentAssessment[],
): DisciplinaResumo[] {
  const resultado: Record<string, DisciplinaResumo> = {}

  for (const item of data) {
    const id = item.disciplina_id

    if (!resultado[id]) {
      resultado[id] = {
        disciplina_id: id,
        media_final: item.media_final,
        disciplina_nome: item.disciplina_nome,
        disciplina_sigla: item.disciplina_sigla,
        classe_id: item.classe_id,
        semestre_id: item.semestre_id,
        avaliacoes: [],
      }
    }

    resultado[id].avaliacoes.push({
      id: item.avaliacao_id,
      tipo: item.tipo_avaliacao_nome,
      designacao: item.tipo_avaliacao_designacao,
      nota: Number(item.nota_final),
      data: item.data_criacao_avaliacao,
      subRows: [],
    })
  }

  return Object.values(resultado).map((disciplina) => ({
    ...disciplina,
    subRows: disciplina.avaliacoes,
  }))
}

const columns: ColumnDef<DisciplinaResumo | Avaliacao>[] = [
  {
    id: 'expander',
    header: () => null,
    cell: ({ row }) => {
      if (!row.getCanExpand()) return null
      return (
        <button
          onClick={row.getToggleExpandedHandler()}
          className="cursor-pointer"
        >
          {row.getIsExpanded() ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      )
    },
  },
  {
    accessorKey: 'disciplina_nome',
    header: 'Disciplina',
    cell: ({ row, getValue }) => {
      const isDisciplina = 'disciplina_nome' in row.original
      if (isDisciplina) {
        return <span className="font-medium">{getValue() as string}</span>
      }
      return null
    },
  },
  {
    accessorKey: 'disciplina_sigla',
    header: 'Sigla',
    cell: ({ row, getValue }) => {
      const isDisciplina = 'disciplina_sigla' in row.original
      if (isDisciplina) {
        return <span>{getValue() as string}</span>
      }
      return null
    },
  },
  {
    accessorKey: 'tipo',
    header: 'Tipo',
    cell: ({ row, getValue }) => {
      const isAvaliacao = 'tipo' in row.original
      if (isAvaliacao) {
        return <span className="text-sm">{getValue() as string}</span>
      }
      return null
    },
  },
  {
    accessorKey: 'designacao',
    header: 'Designação',
    cell: ({ row, getValue }) => {
      const isAvaliacao = 'designacao' in row.original
      if (isAvaliacao) {
        return <span className="text-sm">{getValue() as string}</span>
      }
      return null
    },
  },
  {
    accessorKey: 'nota',
    header: 'Nota',
    cell: ({ row, getValue }) => {
      const isAvaliacao = 'nota' in row.original
      if (isAvaliacao) {
        const nota = getValue() as number
        return (
          <span className="font-semibold text-base">{nota.toFixed(1)}</span>
        )
      }
      return null
    },
  },
  {
    accessorKey: 'media_final',
    header: 'Media Final',
    cell: ({ row, getValue }) => {
      const isMediaFinal = 'media_final' in row.original
      if (isMediaFinal) {
        return <span>{getValue() as string}</span>
      }
      return null
    },
  },
  {
    accessorKey: 'data',
    header: 'Data',
    cell: ({ row, getValue }) => {
      const isAvaliacao = 'data' in row.original
      if (isAvaliacao) {
        return (
          <span className="text-sm">
            {format(new Date(getValue() as string), 'dd/MM/yyyy', {
              locale: pt,
            })}
          </span>
        )
      }
      return null
    },
  },
]

type GradeCurrentAcademicYearProps = {
  enrollmentCode?: string
  classe?: string
  academicYear?: string
}

export function GradeCurrentAcademicYear({
  enrollmentCode,
  classe,
  academicYear,
}: GradeCurrentAcademicYearProps) {
  const { data: assessments = [] } =
    useQueryStudentAssessmentsByCurrentAcademicYear({
      anoLetivo: academicYear,
      classe,
      matricula: enrollmentCode,
    })

  const data = React.useMemo(
    () => agruparAvaliacoesPorDisciplina(assessments),
    [assessments],
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row) => row.subRows,
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notas do Ano Letivo Atual</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={row.depth > 0 ? 'bg-muted/50' : ''}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={row.depth > 0 ? 'pl-8' : ''}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-4"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between p-4 border-t">
          <p className="text-sm text-muted-foreground">
            Página {table.getState().pagination.pageIndex + 1} de{' '}
            {table.getPageCount()}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Próxima
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
