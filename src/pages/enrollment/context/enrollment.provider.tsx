import { useState, useMemo, useEffect, type ReactNode } from 'react'
import type { NewStudentCurriculumSubject } from '@/services/curriculum/new-student-curriculum-plan.service'
import { EnrollmentContext } from './enrollment.context'
import { useQueryNewStudentCurriculumPlan } from '@/hooks/curriculum/use-query-new-student-curriculum-plan'
import { toast } from 'sonner'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useMutationConfirmNewStudentEnrollment } from '@/hooks/enrollment/use-mutation-confirm-new-student-enrollment'

type EnrollmentProviderProps = {
  children: ReactNode
}
// TODO:Criar um subject que sera tanto para novos ou antigos estudantes,
// mudar NewStudentCurriculumSubject pois esse contexto e sua logica
//  deve se aplicar tanto para novos ou antigos estudantes
export function EnrollmentProvider({ children }: EnrollmentProviderProps) {
  const {
    profileData,
    isLoading: profileLoading,
    error: profileError,
    isError: profileIsError,
  } = useQueryProfile()
  const isNewStudent = profileData?.enrollmentCode === undefined ? true : false
  const {
    newStudentCurriculumPlan,
    error: newStudentCurriculumPlanError,
    isLoading: newStudentCurriculumPlanLoading,
    isError: newStudentCurriculumPlanIsError,
  } = useQueryNewStudentCurriculumPlan()

  const {
    confirmNewStudentEnrollmentPending,
    confirmNewStudentEnrollmentAsync,
  } = useMutationConfirmNewStudentEnrollment()

  const [selectedSubjects, setSelectedSubjects] = useState<
    NewStudentCurriculumSubject[]
  >([])
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    if (isNewStudent && newStudentCurriculumPlan) {
      setSelectedSubjects([...newStudentCurriculumPlan])
      setIsExpanded(true)
    }
  }, [newStudentCurriculumPlan, isNewStudent])

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

  const toggleSection = () => {
    setIsExpanded((prev) => !prev)
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
        return
      }

      setSelectedSubjects(allSubjects)
      toast.success('Todas as disciplinas foram selecionadas automaticamente.')
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
  const confirmNewStudentEnrollment = async (
    newStudentCurriculumPlan: NewStudentCurriculumSubject[],
    selectedSubjects: NewStudentCurriculumSubject[],
  ) => {
    const isSelectedAllSubjects =
      newStudentCurriculumPlan.length === selectedSubjects.length

    if (!isSelectedAllSubjects) {
      toast.warning('Selecione todas as disciplinas obrigatórias.')
      return
    }
    await confirmNewStudentEnrollmentAsync(selectedSubjects)
  }

  const confirmStudentEnrollment = () => {
    if (isNewStudent) {
      if (!newStudentCurriculumPlan) {
        toast.error('Disciplinas obrigatórias não selecionadas.')
        return
      }
      confirmNewStudentEnrollment(newStudentCurriculumPlan, selectedSubjects)
      return
    }
    toast.success('Logica para estdante antigo em desenvolvimento!')
  }

  return (
    <EnrollmentContext.Provider
      value={{
        selectedSubjects,
        isLoading: newStudentCurriculumPlanLoading || profileLoading,
        isError: profileIsError || newStudentCurriculumPlanIsError,
        error: profileError || newStudentCurriculumPlanError,
        isExpanded,
        subject: newStudentCurriculumPlan ?? [],
        totalValue,
        toggleSubject,
        isSelected,
        toggleSection,
        selectAll,
        isAllSelected,
        remove,
        removeAll,
        confirmStudentEnrollment,
        confirmNewStudentEnrollmentPending,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  )
}
