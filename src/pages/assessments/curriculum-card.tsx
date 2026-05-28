import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { useQueryCurrentCurriculumPlanSudent } from '@/hooks/curriculum/use-query-current-curriculum-plan-student'
import { useQueryAcademicYearStudent } from '@/hooks/academic-year/use-query-academic-year-student'
import { YearSelect } from '@/components/year-select'
import { SemesterSelect } from '@/components/SemesterSelect'
import StatusBadgeCustom from './components/status-bage'


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
    nota?: string | number
  }
}) {
  return (
    <TableRow key={subject.CodigoGrade}>
      <TableCell className="font-medium">{subject.CodigoDisciplina}</TableCell>
      <TableCell>{subject.disciplina}</TableCell>
      <TableCell>{subject?.ano_lectivo}</TableCell>
      <TableCell>{subject.semestre}</TableCell>
      {/* <TableCell><StatusBadgeCustom media={Number(subject?.nota)} /></TableCell> */}
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
  const [selectedSemester, setSelectedSemester] = useState<string | undefined>(undefined)

  const {
    data: studentCurriculumPlanData,
    isLoading: isStudentCurriculumPlanLoading,
  } = useQueryCurrentCurriculumPlanSudent({
    academicYearCode: selectedYear,
    preEnrollmentCode,
    semester: selectedSemester

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

  const onSelectSemester = useCallback((codeSemester: string | undefined) => {
    if (codeSemester == '3') {
      setSelectedSemester(undefined)
    }
    else {
      setSelectedSemester(codeSemester)
    }
  }, [selectedSemester])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Notas Finais</CardTitle>
          <div className="flex items-center ">
            <div className='mr-1'>
              <YearSelect
                academicYears={academicYears}
                selectedYear={selectedYear}
                onChange={setSelectedYear}
              />
            </div>
            <SemesterSelect onChange={onSelectSemester} />
          </div>
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
                {/*  <TableHead>Estado</TableHead> */}
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

export function dedupeAcademicYears(
  list?: { codigo: string | number; designacao: string; estado: string }[],
) {
  if (!list) return []
  const map = new Map()

  list.forEach((item) => {
    map.set(item.codigo, item) // se tiver repetido, sobrescreve e fica só 1
  })

  return Array.from(map.values())
}
