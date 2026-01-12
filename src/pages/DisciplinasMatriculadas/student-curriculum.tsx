import { useState, useMemo, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Calendar, BookOpen } from 'lucide-react'
import { useFetchDisciplines } from '@/hooks/discipline/use-fetch-disciplines'
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { YearSelect } from '@/components/year-select'
import { useYearSelect } from '@/components/year-select/use-year-select'
import { useQuerySemesters } from '@/hooks/semester/use-query-semester'
import type { ProfileData } from '@/types/profile'

type Discipline = {
  disciplina: string
  semestre: string
  duracao: string
  classe: string
  ano_lectivo: string
}

type StudentCurriculumProps = {
  profileData: ProfileData
}

export const StudentCurriculum = ({ profileData }: StudentCurriculumProps) => {
  const { academicYears, defaultYear } = useYearSelect(
    profileData.enrollmentCode,
  )
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [selectedSemester, setSelectedSemester] = useState<string>('1')
  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    undefined,
  )

  const { data: semestersResponse, isLoading: isLoadingSemesters } =
    useQuerySemesters()

  const { data, isLoading } = useFetchDisciplines({
    anoLectivo: selectedYear!,
    semestre: selectedSemester ?? 1,
    matriculaId: profileData.enrollmentCode,
    page,
    limit,
  })

  useEffect(() => {
    if (defaultYear) setSelectedYear(defaultYear)
  }, [defaultYear])

  const semesters = semestersResponse?.items ?? []
  const disciplines = data?.data ?? []

  const columnHelper = createColumnHelper<Discipline>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('disciplina', {
        header: 'Disciplina',
        cell: (info) => (
          <div className="flex items-center gap-2 text-left">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor('classe', {
        header: 'Classe',
        cell: (info) => <span className="text-center">{info.getValue()}</span>,
      }),
      columnHelper.accessor('semestre', {
        header: 'Semestre',
        cell: (info) => (
          <div className="flex items-center justify-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor('duracao', {
        header: 'Duração',
        cell: (info) => <span className="text-center">{info.getValue()}</span>,
      }),
      columnHelper.accessor('ano_lectivo', {
        header: 'Ano Letivo',
        cell: (info) => <span className="text-center">{info.getValue()}</span>,
      }),
    ],
    [columnHelper],
  )
console.log(academicYears)
  const table = useReactTable({
    data: disciplines,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>
              Disciplinas do Ano {" "} {" "}
              {academicYears.find((a) =>  a.codigo.toString() === selectedYear?.toString())?.designacao}
            </CardTitle>
            <CardDescription>
              Cadeiras pertencentes à sua grade curricular {}
            </CardDescription>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Select
              value={selectedSemester}
              onValueChange={setSelectedSemester}
              disabled={isLoadingSemesters}
            >
              <SelectTrigger className="min-w-[120px]">
                <SelectValue placeholder="Semestre" />
              </SelectTrigger>
              <SelectContent>
                {semesters
                  .filter((s) => s.codigo !== 3)
                  .map((s) => (
                    <SelectItem key={s.codigo} value={String(s.codigo)}>
                      {s.designacao}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <YearSelect
              academicYears={academicYears}
              selectedYear={selectedYear}
              onChange={setSelectedYear}
            />

            <Select
              value={limit.toString()}
              onValueChange={(val) => setLimit(Number(val))}
            >
              <SelectTrigger className="min-w-[100px]">
                <SelectValue placeholder="Linhas" />
              </SelectTrigger>
              <SelectContent>
                {[10, 15, 20].map((l) => (
                  <SelectItem key={l} value={l.toString()}>
                    {l} linhas
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="rounded-md border overflow-x-auto mx-4">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-center sm:text-left py-3 font-semibold text-xs text-gray-300 uppercase"
                      >
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
                  Array.from({ length: limit }).map((_, idx) => (
                    <TableRow key={`skeleton-${idx}`} className="animate-pulse">
                      {columns.map((_, cidx) => (
                        <TableCell key={cidx} className="py-2 text-center">
                          <Skeleton className="h-4 w-full rounded-md" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : disciplines.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-32 text-center text-muted-foreground"
                    >
                      Nenhuma disciplina encontrada para os filtros
                      selecionados.
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="hover:bg-muted/50">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="text-center sm:text-left py-2 text-sm"
                        >
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

            {/* Paginação */}
            <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/10">
              <div className="text-sm text-muted-foreground">
                Página <strong>{data?.page || 1}</strong> de{' '}
                <strong>{data?.totalPages || 1}</strong>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === (data?.totalPages || 1)}
                >
                  Próxima
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
