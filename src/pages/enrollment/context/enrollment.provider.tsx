import { useState, type ReactNode } from 'react'
import { EnrollmentContext } from './enrollment.context'

import { toast } from 'sonner'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useMutationConfirmNewStudentEnrollment } from '@/hooks/enrollment/use-mutation-confirm-new-student-enrollment'
import type { Grade } from '@/types/grade'
import { useQueryCurriculumPlan } from '@/hooks/curriculum/use-query-curriculum-plan'
import type { SectionKey, SelectedSchedule } from '../types/enrollment'
import { useQueryCurriculumPlanPendents } from '@/hooks/curriculum/use-query-curriculum-plan-pendents'
import { useMutationConfirmOldStudentEnrollment } from '@/hooks/enrollment/use-mutation-confirm-old-student-enrollment'

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

  const {
    data: grades,
    error: studentCurriculumPlanError,
    isLoading: studentCurriculumPlanLoading,
    isError: studentCurriculumPlanIsError,
  } = useQueryCurriculumPlan({
    class: profileData?.confirmacoes?.[0]?.classe,
    course: profileData?.codigo_curso,
  })

  const {
    confirmNewStudentEnrollmentPending,
    confirmNewStudentEnrollmentAsync,
  } = useMutationConfirmNewStudentEnrollment()

  const {
    confirmOldStudentEnrollmentAsync,
    confirmOldStudentEnrollmentPending,
  } = useMutationConfirmOldStudentEnrollment()
  const isNewStudent =
    profileData?.codigo_matricula === undefined ? true : false
  const {
    data: pendentsGrades,
    error: studentCurriculumPlanPendentsError,
    isLoading: studentCurriculumPlanPendentsLoading,
    isError: studentCurriculumPlanPendentsIsError,
  } = useQueryCurriculumPlanPendents(
    profileData?.preEnrollmentCode,
    !isNewStudent,
  )

  // Horários selecionados por disciplina (mapeados pelo código da grade)
  const [selectedSchedules, setSelectedSchedules] = useState<
    Record<string, SelectedSchedule>
  >({})

  const [selectedSubjects, setSelectedSubjects] = useState<Grade[]>([])

  const maxCourseGrade = Number(profileData?.max_cadeiras_curso)
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

    setSelectedSubjects((prev) => {
      const alreadySelected = prev.some(
        (s) => s.codigoGrade === subject.codigoGrade,
      )

      if (alreadySelected) {
        // Ao remover a disciplina, remover também o horário associado
        removeScheduleForSubject(subject.codigoGrade)
        return prev.filter((s) => s.codigoGrade !== subject.codigoGrade)
      }

      return [...prev, subject]
    })
  }

  const selectScheduleForSubject = (
    codigoGrade: string,
    horario: SelectedSchedule,
  ) => {
    setSelectedSchedules((prev) => ({
      ...prev,
      [codigoGrade]: horario,
    }))
  }

  // Remover o horário associado a uma disciplina
  const removeScheduleForSubject = (codigoGrade: string) => {
    setSelectedSchedules((prev) => {
      const updated = { ...prev }
      delete updated[codigoGrade]
      return updated
    })
  }

  // =====================
  // 📦 Gerar payload final
  // =====================

  const getOldStudentEnrollmentPayload = () => {
    const selectedGrades = selectedSubjects.map((subject) => {
      const horario = selectedSchedules[subject.codigoGrade]
      return {
        codigoGrade: subject.codigoGrade,
        codigoHorario: horario?.codigoHorario || null,
        descHorario: horario?.descHorario || '',
      }
    })
    if (!profileData?.enrollmentCode) {
      throw new Error('Enrollment code is missing')
    }
    return { enrollmentCode: profileData?.enrollmentCode, selectedGrades }
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
  const confirmStudentEnrollment = async () => {
    // ====== 📚 NOVO ESTUDANTE ======
    if (isNewStudent) {
      if (!grades) {
        toast.error('Disciplinas obrigatórias não selecionadas.')
        return
      }
      confirmNewStudentEnrollment(grades, selectedSubjects)
      return
    }

    if (selectedSubjects.length === 0) {
      toast.warning('Nenhuma disciplina selecionada.')
      return
    }

    if (selectedSubjects.length > maxCourseGrade) {
      toast.error(`Não é permitido ultrapassar ${maxCourseGrade} disciplinas.`)
      return
    }

    // 2️⃣ Verifica se há pendentes ainda não selecionadas
    const unselectedPendents = (pendentsGrades ?? []).filter(
      (p) => !selectedSubjects.some((s) => s.codigoGrade === p.codigoGrade),
    )

    const selectedNews = (grades ?? []).filter((g) =>
      selectedSubjects.some((s) => s.codigoGrade === g.codigoGrade),
    )

    if (unselectedPendents.length > 0 && selectedNews.length > 0) {
      toast.warning('Ainda há disciplinas pendentes não selecionadas.', {
        description: 'Finalize as pendentes antes de adicionar novas cadeiras.',
      })
      return
    }

    // 3️⃣ Verifica se todas as disciplinas selecionadas têm horário
    const missingSchedules = selectedSubjects.filter(
      (subject) => !selectedSchedules[subject.codigoGrade]?.codigoHorario,
    )

    if (missingSchedules.length > 0) {
      const missingNames = missingSchedules.map((s) => s.disciplina).join(', ')
      toast.warning(`Selecione o horário para: ${missingNames}`, {
        description:
          'Cada disciplina precisa ter um horário definido antes de continuar.',
      })
      return
    }

    const payload = getOldStudentEnrollmentPayload()
    await confirmOldStudentEnrollmentAsync(payload.selectedGrades)
  }

  return (
    <EnrollmentContext.Provider
      value={{
        selectedSubjects,
        isLoading:
          studentCurriculumPlanLoading ||
          profileLoading ||
          studentCurriculumPlanPendentsLoading,
        isError:
          profileIsError ||
          studentCurriculumPlanIsError ||
          studentCurriculumPlanPendentsIsError,
        error:
          profileError ||
          studentCurriculumPlanError ||
          studentCurriculumPlanPendentsError,
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
        confirmStudentEnrollmentState:
          confirmOldStudentEnrollmentPending ||
          confirmNewStudentEnrollmentPending,
        removeScheduleForSubject,
        selectScheduleForSubject,
        selectedSchedules,

        isNewStudent,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  )
}
