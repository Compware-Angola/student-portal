import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

import { cn } from '@/lib/utils'
import { useQueryCurrentCurriculumPlanSudent } from '@/hooks/curriculum/use-query-current-curriculum-plan-student'
import { useQueryAcademicYearStudent } from '@/hooks/academic-year/use-query-academic-year-student'
import { YearSelect } from '@/components/year-select'

/* =======================
   Componente Badge de Estado
======================= */
function StatusBadge({ estado }: { estado: string }) {
  const isSuccess = estado === 'Fez com Sucesso'

  const baseClasses =
    'rounded-full border-none focus-visible:outline-none focus-visible:ring-2'
  const colorClasses = isSuccess
    ? 'bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40'
    : 'bg-amber-600/10 text-amber-600 focus-visible:ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400 dark:focus-visible:ring-amber-400/40'

  const dotClasses = isSuccess
    ? 'size-1.5 rounded-full bg-green-600 dark:bg-green-400'
    : 'size-1.5 rounded-full bg-amber-600 dark:bg-amber-400'

  return (
    <Badge className={cn(baseClasses, colorClasses)}>
      <span className={dotClasses} aria-hidden="true" />
      {estado}
    </Badge>
  )
}

/* =======================
   Componente Linha da Tabela
======================= */
function CurriculumRow({
  subject,
}: {
  subject: {
    CodigoGrade: string
    CodigoDisciplina: string
    ano_lectivo: string
    disciplina: string
    semestre: string
    estado: string
    nota?: string | number
  }
}) {
  return (
    <TableRow key={subject.CodigoGrade}>
      <TableCell className="font-medium">{subject.CodigoDisciplina}</TableCell>
      <TableCell>{subject.disciplina}</TableCell>
      <TableCell>{subject.ano_lectivo}</TableCell>
      <TableCell>{subject.semestre}</TableCell>
      <TableCell>
        <StatusBadge estado={subject.estado} />
      </TableCell>
      <TableCell className="text-right font-medium">{subject.nota}</TableCell>
    </TableRow>
  )
}

/* =======================
   Componente Principal
======================= */
export function CurriculumCard({
  preEnrollmentCode,
  enrollmentCode,
}: {
  preEnrollmentCode: string
  enrollmentCode: string
}) {
  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    undefined,
  )

  const {
    data: studentCurriculumPlanData,
    isLoading: isStudentCurriculumPlanLoading,
  } = useQueryCurrentCurriculumPlanSudent({
    academicYearCode: selectedYear,
    preEnrollmentCode,
  })

  const { data: academicYearData } = useQueryAcademicYearStudent(enrollmentCode)
  const academicYears = dedupeAcademicYears(academicYearData?.anolectivos)
  useEffect(() => {
    if (!academicYears) return

    // Encontrar o ano ativo
    const active = academicYears.find((y) => y.estado === 'Activo')

    if (active && !selectedYear) {
      setSelectedYear(String(active.codigo))
    }
  }, [academicYears, setSelectedYear])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notas Finais</CardTitle>
        <div className="mt-4">
          <YearSelect
            academicYears={academicYears}
            selectedYear={selectedYear}
            onChange={setSelectedYear}
          />
        </div>
      </CardHeader>

      <CardContent>
        {isStudentCurriculumPlanLoading ? (
          <p>Carregando as Notas...</p>
        ) : !studentCurriculumPlanData?.length ? (
          <p>Não há avaliações disponíveis.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead>Ano Lectivo</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Nota</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentCurriculumPlanData.map((subject) => (
                <CurriculumRow key={subject.CodigoGrade} subject={subject} />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

function dedupeAcademicYears(
  list?: { codigo: string | number; designacao: string; estado: string }[],
) {
  if (!list) return []
  const map = new Map()

  list.forEach((item) => {
    map.set(item.codigo, item) // se tiver repetido, sobrescreve e fica só 1
  })

  return Array.from(map.values())
}
