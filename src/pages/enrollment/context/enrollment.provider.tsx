import { useState, useMemo, useEffect, type ReactNode } from 'react'
import type { NewStudentCurriculumSubject } from '@/services/curriculum/new-student-curriculum-plan.service'
import type { ExpandedSections } from '../types/enrollment'
import { EnrollmentContext } from './enrollment.context'
import { useQueryNewStudentCurriculumPlan } from '@/hooks/curriculum/use-query-new-student-curriculum-plan'
import { toast } from 'sonner'
const isNewStudent = true
type EnrollmentProviderProps = {
  children: ReactNode
}

export function EnrollmentProvider({ children }: EnrollmentProviderProps) {
  const { newStudentCurriculumPlan, error, isLoading } =
    useQueryNewStudentCurriculumPlan('383472')

  const [selectedSubjects, setSelectedSubjects] = useState<
    NewStudentCurriculumSubject[]
  >([])
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    'ANUAL': true,
    'I SEMESTRE': true,
    'II SEMESTRE': true,
  })

  useEffect(() => {
    if (isNewStudent && newStudentCurriculumPlan?.length) {
      setSelectedSubjects([...newStudentCurriculumPlan])
    }
  }, [newStudentCurriculumPlan])

  const getUniqueSubjects = (
    subjects: NewStudentCurriculumSubject[],
  ): NewStudentCurriculumSubject[] => {
    const seen = new Set<string>()
    return subjects.filter((subject) => {
      if (seen.has(subject.codigoGrade)) return false
      seen.add(subject.codigoGrade)
      return true
    })
  }

  const uniqueSubjects = useMemo(
    () => getUniqueSubjects(newStudentCurriculumPlan ?? []),
    [newStudentCurriculumPlan],
  )

  const annual = useMemo(
    () => uniqueSubjects.filter((s) => s.duracaoDisciplina === 'Anual'),
    [uniqueSubjects],
  )

  const firstSemester = useMemo(
    () =>
      uniqueSubjects.filter(
        (s) =>
          s.duracaoDisciplina === 'Semestral' && s.semestre === 'I SEMESTRE',
      ),
    [uniqueSubjects],
  )

  const secondSemester = useMemo(
    () =>
      uniqueSubjects.filter(
        (s) =>
          s.duracaoDisciplina === 'Semestral' && s.semestre === 'II SEMESTRE',
      ),
    [uniqueSubjects],
  )

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const isSelected = (subject: NewStudentCurriculumSubject) =>
    selectedSubjects.some((s) => s.codigoGrade === subject.codigoGrade)

  const isAllSelected = () => {
    const all = [...annual, ...firstSemester, ...secondSemester]
    return (
      all.length > 0 &&
      all.every((s) =>
        selectedSubjects.some((x) => x.codigoGrade === s.codigoGrade),
      )
    )
  }

  const toggleSubject = (subject: NewStudentCurriculumSubject) => {
    if (isNewStudent) {
      toast.warning('Novo estudante não pode remover disciplinas obrigatórias.')
      return
    }

    setSelectedSubjects((prev) =>
      prev.some((s) => s.codigoGrade === subject.codigoGrade)
        ? prev.filter((s) => s.codigoGrade !== subject.codigoGrade)
        : [...prev, subject],
    )
  }

  const selectAll = () => {
    const allSubjects = [...annual, ...firstSemester, ...secondSemester]
    const allSelected = isAllSelected()

    if (isNewStudent) {
      if (allSelected) {
        toast.warning(
          'Novo estudante deve manter todas as disciplinas selecionadas.',
        )
      } else {
        setSelectedSubjects(allSubjects)
        toast.success(
          'Todas as disciplinas foram selecionadas automaticamente.',
        )
      }
      return
    }

    setSelectedSubjects(allSelected ? [] : allSubjects)
  }

  const remove = (codigoGrade: string) => {
    const subject = selectedSubjects.find((s) => s.codigoGrade === codigoGrade)
    if (subject) toggleSubject(subject)
  }

  const removeAll = () => {
    if (isNewStudent) {
      toast.warning('Novo estudante não pode remover disciplinas obrigatórias.')
      return
    }
    setSelectedSubjects([])
  }

  const totalValue = selectedSubjects.reduce(
    (sum, s) => sum + parseInt(s.valorInscricao),
    0,
  )

  return (
    <EnrollmentContext.Provider
      value={{
        annual,
        firstSemester,
        secondSemester,
        selectedSubjects,
        expandedSections,
        totalValue,
        toggleSubject,
        isSelected,
        toggleSection,
        selectAll,
        isAllSelected,
        error,
        isLoading,
        remove,
        removeAll,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  )
}
