'use client'

import * as React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
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
import { Badge } from '@/components/ui/badge'

import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { useQueryStudentAssessmentsByCurrentAcademicYear } from '@/hooks/assessments/use-query-student-assessments-by-current-academic-year'
import type { StudentAssessment } from '@/services/assessments/student-assessments-by-current-academic-year.service'

function getStatusLabel(status: string) {
  switch (status) {
    case '1':
      return { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' }
    case '2':
      return { label: 'Concluída', color: 'bg-green-100 text-green-800' }
    case '3':
      return { label: 'Cancelada', color: 'bg-red-100 text-red-800' }
    default:
      return { label: 'Desconhecido', color: 'bg-gray-100 text-gray-800' }
  }
}

// --- Definir colunas
const columns: ColumnDef<StudentAssessment>[] = [
  { accessorKey: 'disciplina_nome', header: 'Disciplina' },
  { accessorKey: 'disciplina_sigla', header: 'Sigla' },
  { accessorKey: 'tipo_avaliacao_designacao', header: 'Tipo' },
  { accessorKey: 'epoca_descricao', header: 'Época' },
  {
    accessorKey: 'nota_final',
    header: 'Nota',
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'status_avaliacao',
    header: 'Status',
    cell: ({ getValue }) => {
      const s = getStatusLabel(getValue() as string)
      return (
        <Badge className={`${s.color} border-transparent`}>{s.label}</Badge>
      )
    },
  },
  {
    accessorKey: 'data_criacao_avaliacao',
    header: 'Data',
    cell: ({ getValue }) =>
      format(new Date(getValue() as string), 'dd/MM/yyyy', { locale: pt }),
  },
  {
    accessorKey: 'usuario_avaliador_id',
    header: 'Avaliador',
    cell: ({ getValue }) => {
      const obj = JSON.parse(getValue() as string)
      return <span>{obj.desc}</span>
    },
  },
]
export function GradeTable() {
  const { data: assessments } =
    useQueryStudentAssessmentsByCurrentAcademicYear()
  const data = React.useMemo(() => assessments, [assessments])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className="">
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
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4">
                Nenhum resultado encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Paginação */}
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
    </div>
  )
}
