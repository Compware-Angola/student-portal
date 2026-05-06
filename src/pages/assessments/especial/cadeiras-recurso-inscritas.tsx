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

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useQueryAcademicYearStudent } from '@/hooks/academic-year/use-query-academic-year-student'
import { YearSelect } from '@/components/year-select'
import { dedupeAcademicYears } from '../curriculum-card'
import { parseFilter } from '@/utils'
import { TableSkeleton } from '@/components/table-skeleton'
import { useQueryCadeirasEpocaEspecialInscritas } from '@/hooks/assessments/recursos'
import type { CadeiraRecursoInscrita } from '@/services/assessments/recursos.service'

export function CadeirasRecursoInscritas() {
  const { profileData } = useQueryProfile()

  const [selectedYear, setSelectedYear] = React.useState<string>()

  const { data: academicYearData } = useQueryAcademicYearStudent(
    profileData?.enrollmentCode,
  )

  const academicYears = dedupeAcademicYears(academicYearData?.anolectivos)

  const { data, isLoading } = useQueryCadeirasEpocaEspecialInscritas({
    anoLetivo: parseFilter(selectedYear),
    matricula: parseFilter(profileData?.enrollmentCode),
  })

  const cadeiras = React.useMemo(() => data?.cadeirasInscritas ?? [], [data])

  React.useEffect(() => {
    if (!academicYears) return
    const active = academicYears.find((y) => y.estado === 'Activo')
    if (active && !selectedYear) {
      setSelectedYear(String(active.codigo))
    }
  }, [academicYears, selectedYear])

  const columns = React.useMemo<ColumnDef<CadeiraRecursoInscrita>[]>(
    () => [
      { accessorKey: 'codigo_grade_aluno', header: 'Código' },
      { accessorKey: 'disciplina', header: 'Disciplina' },
      { accessorKey: 'classe', header: 'Classe' },
      { accessorKey: 'semestre', header: 'Semestre' },
    ],
    [],
  )

  const table = useReactTable({
    data: cadeiras,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Cadeiras Inscritas na Época Especial</CardTitle>

          <YearSelect
            academicYears={academicYears}
            selectedYear={selectedYear}
            onChange={setSelectedYear}
          />
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={columns.length} rows={10} />
            ) : !cadeiras.length ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-6"
                >
                  Nenhuma cadeira inscrita
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {!isLoading && cadeiras.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm">
              Página {table.getState().pagination.pageIndex + 1} de{' '}
              {table.getPageCount()}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Anterior
              </button>

              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
