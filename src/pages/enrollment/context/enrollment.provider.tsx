import { useState, type ReactNode } from 'react'
import { EnrollmentContext } from './enrollment.context'

import { toast } from 'sonner'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useMutationConfirmNewStudentEnrollment } from '@/hooks/enrollment/use-mutation-confirm-new-student-enrollment'
import type { Grade } from '@/types/grade'
import { useQueryCurriculumPlan } from '@/hooks/curriculum/use-query-curriculum-plan'
import type {
  EnrollmentPayloadItem,
  SectionKey,
  SelectedSchedule,
} from '../types/enrollment'
import { useQueryCurriculumPlanPendents } from '@/hooks/curriculum/use-query-curriculum-plan-pendents'

type ToggleState = {
  new: boolean
  pendents: boolean
}
type EnrollmentProviderProps = {
  children: ReactNode
  isNewStudent?: boolean
}

export function EnrollmentProvider({
  children,
  isNewStudent = false,
}: EnrollmentProviderProps) {
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

  // Horários selecionados por disciplina (mapeados pelo código da grade)
  const [selectedSchedules, setSelectedSchedules] = useState<
    Record<string, SelectedSchedule>
  >({})

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

  const getEnrollmentPayload = () => {
    const grades = selectedSubjects.map((subject) => {
      const horario = selectedSchedules[subject.codigoGrade]
      return {
        codigoGrade: subject.codigoGrade,
        codigoHorario: horario?.codigoHorario || null,
        descHorario: horario?.descHorario || '',
      }
    })
    return { grades } as { grades: EnrollmentPayloadItem[] }
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

    if (selectedSubjects.length === 0) {
      toast.warning('Nenhuma disciplina selecionada.')
      return
    }

    // 🔍 Verifica se todas as disciplinas selecionadas têm horário
    const missingSchedules = selectedSubjects.filter(
      (subject) => !selectedSchedules[subject.codigoGrade]?.codigoHorario,
    )

    if (missingSchedules.length > 0) {
      const missingNames = missingSchedules
        .map((s) => s.disciplina || s.disciplina)
        .join(', ')
      toast.warning(`Selecione o horário para: ${missingNames}`, {
        description:
          'Cada disciplina precisa ter um horário definido antes de continuar.',
      })
      return
    }

    // 🧾 Se chegou até aqui, tudo certo — pode enviar
    const payload = getEnrollmentPayload()
    console.log('✅ Payload final pronto para envio:', payload)

    toast.success('Matrícula pronta para envio!')
    // Aqui podes chamar a mutation ou função de envio, ex:
    // confirmStudentEnrollmentAsync(payload)
  }

  console.log({ payload: getEnrollmentPayload() })
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
        removeScheduleForSubject,
        selectScheduleForSubject,
        selectedSchedules,
        getEnrollmentPayload,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  )
}
