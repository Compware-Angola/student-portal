import { useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useQueryStudentCurriculumPlan } from '@/hooks/curriculum/use-query-curriculum-plan'
import { useQueryAcademicYear } from '@/hooks/academic-year/use-query-academic-year'
import { cn } from '@/lib/utils'

/* =======================
   Componente Select de Ano
======================= */
function YearSelect({
  academicYears,
  selectedYear,
  onChange,
}: {
  academicYears?: { codigo: string; designacao: string }[]
  selectedYear?: string
  onChange: (value: string) => void
}) {
  return (
    <Select value={selectedYear} onValueChange={onChange}>
      <SelectTrigger className="min-w-60">
        <SelectValue placeholder="Selecione o ano letivo" />
      </SelectTrigger>
      <SelectContent>
        {academicYears?.map((year) => (
          <SelectItem key={year.codigo} value={year.codigo}>
            {year.designacao}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

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
}: {
  preEnrollmentCode: string
}) {
  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    undefined,
  )

  const {
    data: studentCurriculumPlanData,
    isLoading: isStudentCurriculumPlanLoading,
  } = useQueryStudentCurriculumPlan({
    academicYearCode: selectedYear,
    preEnrollmentCode,
  })

  const { data: academicYearData } = useQueryAcademicYear()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Curricular</CardTitle>
        <div className="mt-4">
          <YearSelect
            academicYears={academicYearData?.anolectivos}
            selectedYear={selectedYear}
            onChange={setSelectedYear}
          />
        </div>
      </CardHeader>

      <CardContent>
        {isStudentCurriculumPlanLoading ? (
          <p>Carregando plano curricular...</p>
        ) : !studentCurriculumPlanData?.grades?.length ? (
          <p>Não há plano curricular disponível.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Nota</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentCurriculumPlanData.grades.map((subject) => (
                <CurriculumRow key={subject.CodigoGrade} subject={subject} />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
