import { useState, type ReactNode } from 'react'
import { EnrollmentContext } from './enrollment.context'

import { toast } from 'sonner'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useMutationConfirmNewStudentEnrollment } from '@/hooks/enrollment/use-mutation-confirm-new-student-enrollment'
import type { Grade } from '@/types/grade'
import { useQueryCurriculumPlan } from '@/hooks/curriculum/use-query-curriculum-plan'
import type { SectionKey } from '../types/enrollment'
import { useQueryCurriculumPlanPendents } from '@/hooks/curriculum/use-query-curriculum-plan-pendents'

type ToggleState = {
  new: boolean
  pendents: boolean
}
type EnrollmentProviderProps = {
  children: ReactNode
}

export function EnrollmentProvider({ children }: EnrollmentProviderProps) {
  const [isExpanded, setIsExpanded] = useState<ToggleState>({
    new: false,
    pendents: false,
  })
  const {
    profileData,
    isLoading: profileLoading,
    error: profileError,
    isError: profileIsError,
  } = useQueryProfile()
  const isNewStudent = profileData?.enrollmentCode === undefined ? true : false
  const {
    data: grades,
    error: newStudentCurriculumPlanError,
    isLoading: newStudentCurriculumPlanLoading,
    isError: newStudentCurriculumPlanIsError,
  } = useQueryCurriculumPlan({
    class: profileData?.confirmacoes?.[0]?.classe,
    course: profileData?.codigo_curso,
  })

  const {
    confirmNewStudentEnrollmentPending,
    confirmNewStudentEnrollmentAsync,
  } = useMutationConfirmNewStudentEnrollment()

  const { data: pendentsGrades } = useQueryCurriculumPlanPendents()

  const [selectedSubjects, setSelectedSubjects] = useState<Grade[]>([])

  const toggleSection = (section: SectionKey) => {
    setIsExpanded((prev) => {
      return {
        ...prev,
        [section]: !prev[section],
      }
    })
  }
  const isSelected = (subject: Grade) =>
    selectedSubjects.some((s) => s.codigoGrade === subject.codigoGrade)

  const isAllSelected = () => {
    const all = [...grades, ...pendentsGrades]
    return (
      all.length > 0 &&
      all.every((s) =>
        selectedSubjects.some((x) => x.codigoGrade === s.codigoGrade),
      )
    )
  }

  const toggleSubject = (subject: Grade) => {
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
    const allSubjects = [...grades, ...pendentsGrades]
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
    newStudentCurriculumPlan: Grade[],
    selectedSubjects: Grade[],
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
      if (!grades) {
        toast.error('Disciplinas obrigatórias não selecionadas.')
        return
      }
      confirmNewStudentEnrollment(grades, selectedSubjects)
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
        subject: grades ?? [],
        pendingSubjects: pendentsGrades ?? [],
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
