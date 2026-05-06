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

import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useQueryAcademicYearStudent } from '@/hooks/academic-year/use-query-academic-year-student'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { YearSelect } from '@/components/year-select'
// import { SemesterSelect } from '@/components/SemesterSelect'
import {
  useMutateInscricaoEpocaEspecial,
  useQueryCadeirasEpocaEspecial,
} from '@/hooks/assessments/recursos'
import { dedupeAcademicYears } from '../curriculum-card'
import { parseFilter } from '@/utils'
import type { Cadeira } from '@/services/assessments/recursos.service'
import { TableSkeleton } from '@/components/table-skeleton'
import { Loader2 } from 'lucide-react'

export function CadeirasDisponiveis() {
  const { profileData } = useQueryProfile()

  const [selectedYear, setSelectedYear] = React.useState<string>()
  // const [selectedSemester, setSelectedSemester] = React.useState<string>()
  const [selectedCadeiras, setSelectedCadeiras] = React.useState<
    {
      codigoGrade: number
      codigoGradeAluno: number
      disciplina: string
    }[]
  >([])

  const { data: academicYearData } = useQueryAcademicYearStudent(
    profileData?.enrollmentCode,
  )

  const academicYears = dedupeAcademicYears(academicYearData?.anolectivos)

  const { data: cadeirasRecurosData, isLoading } =
    useQueryCadeirasEpocaEspecial({
      anoLetivo: parseFilter(selectedYear),
      matricula: parseFilter(profileData?.enrollmentCode),
      // semestre: parseFilter(selectedSemester),
    })
  const {
    mutateAsync: mutateInscricaoEpocaEspecial,
    isPending: isPendingInscricaoEpocaEspecial,
  } = useMutateInscricaoEpocaEspecial()

  const data = React.useMemo(
    () => cadeirasRecurosData?.cadeiras ?? [],
    [cadeirasRecurosData],
  )

  React.useEffect(() => {
    if (!academicYears) return
    const active = academicYears.find((y) => y.estado === 'Activo')
    if (active && !selectedYear) {
      setSelectedYear(String(active.codigo))
    }
  }, [academicYears, selectedYear])

  React.useEffect(() => {
    if (!data.length) return
    setSelectedCadeiras((prev) =>
      prev.filter((c) =>
        data.some((d) => d.codigoGradeAluno === c.codigoGradeAluno),
      ),
    )
  }, [data])

  // const onSelectSemester = (value?: string) => {
  //   setSelectedSemester(value === '3' ? undefined : value)
  // }

  function toggleCadeira(row: Cadeira) {
    setSelectedCadeiras((prev) => {
      const exists = prev.find(
        (c) => c.codigoGradeAluno === row.codigoGradeAluno,
      )
      if (exists) {
        return prev.filter((c) => c.codigoGradeAluno !== row.codigoGradeAluno)
      }
      return [
        ...prev,
        {
          codigoGradeAluno: row.codigoGradeAluno,
          disciplina: row.disciplina,
          codigoGrade: row.gradeCurricula,
        },
      ]
    })
  }
  const enrollmentCode = parseFilter(profileData?.enrollmentCode)
  function handleInscricaoEpocaEspecial() {
    if (!enrollmentCode) return
    mutateInscricaoEpocaEspecial({
      codigoMatricula: enrollmentCode,
      gradesAlunos: selectedCadeiras.map((c) => ({
        codigoGradeAluno: c.codigoGradeAluno,
        codigoGrade: c.codigoGrade,
        unidadeCurricular: c.disciplina,
      })),
    })
  }

  const columns = React.useMemo<ColumnDef<Cadeira>[]>(
    () => [
      {
        id: 'select',
        header: 'Selecionar',
        cell: ({ row }) => {
          const isSelected = selectedCadeiras.some(
            (c) => c.codigoGradeAluno === row.original.codigoGradeAluno,
          )
          return (
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => toggleCadeira(row.original)}
            />
          )
        },
      },
      { accessorKey: 'codigoGradeAluno', header: 'Código' },
      { accessorKey: 'disciplina', header: 'Disciplina' },
      { accessorKey: 'ano', header: 'Ano' },
      { accessorKey: 'semestre', header: 'Semestre' },
      { accessorKey: 'resultado', header: 'Resultado' },
    ],
    [selectedCadeiras],
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Exame Especial</CardTitle>

          <div className="flex gap-2">
            <YearSelect
              academicYears={academicYears}
              selectedYear={selectedYear}
              onChange={setSelectedYear}
            />
            {/* <SemesterSelect onChange={onSelectSemester} /> */}
          </div>
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
            ) : !data.length ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-6"
                >
                  Nenhuma cadeira disponível
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

        {!isLoading && data.length > 0 && (
          <>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm">
                Página {table.getState().pagination.pageIndex + 1} de{' '}
                {table.getPageCount()}
              </span>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Anterior
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Próxima
                </Button>
              </div>
            </div>

            {selectedCadeiras.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold mb-2">Selecionadas</h3>
                <ul className="space-y-2">
                  {selectedCadeiras.map((c) => (
                    <li key={c.codigoGradeAluno} className="border p-2 rounded">
                      <strong>{c.codigoGradeAluno}</strong> - {c.disciplina}
                    </li>
                  ))}
                  <Button
                    disabled={
                      !enrollmentCode ||
                      selectedCadeiras.length === 0 ||
                      isPendingInscricaoEpocaEspecial
                    }
                    onClick={handleInscricaoEpocaEspecial}
                  >
                    {isPendingInscricaoEpocaEspecial ? (
                      <>
                        <Loader2 className="animate-spin mr-2" />
                        <span>Inscrevendo...</span>
                      </>
                    ) : (
                      'Inscrever'
                    )}
                  </Button>
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
