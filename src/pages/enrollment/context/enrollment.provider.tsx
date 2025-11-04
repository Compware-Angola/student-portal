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
import { useMutationCreateInvoice } from '@/hooks/invoice/use-mutation-create-invoice'
import type { CreateInvoiceBody } from '@/services/invoice/post-invoice.service'
import { useMutationCreatePaymentReferenceMensalidades } from '@/hooks/invoice/use-mutation-payment-monthly'
import type { CreatePaymentReferenceBody } from '@/services/invoice/post-invoice-monthly.service'
import { useQueryMonthlyFeesValue } from '@/hooks/finance/use-query-monthly-fee'

type ToggleState = {
  new: boolean
  pendents: boolean
}
type EnrollmentProviderProps = {
  children: ReactNode
}

export function EnrollmentProvider({ children }: EnrollmentProviderProps) {
  const [isExpanded, setIsExpanded] = useState<ToggleState>({
    new: true,
    pendents: true,
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
    class: profileData?.confirmacoes?.[0]?.classe ?? '1',
    course: profileData?.codigo_curso,
  })

  const { createPaymentReference } =
    useMutationCreatePaymentReferenceMensalidades()

  const { data: monthlyFeeValue, isError: isMonthlyFeeValueErro } =
    useQueryMonthlyFeesValue({
      curso: profileData?.codigo_curso,
      polo: profileData?.poloId,
      anoLetivo: '23',
    })

  const {
    confirmNewStudentEnrollmentPending,
    confirmNewStudentEnrollmentAsync,
  } = useMutationConfirmNewStudentEnrollment()

  const { createInvoiceAsync } = useMutationCreateInvoice()

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

  const createInvoiceWithPayload = async (
    description: string,
    serviceTypeCode: number,
    enrollmentCode: number,
  ) => {
    const invoice: CreateInvoiceBody = {
      polo_id: 1,
      TotalPreco: totalValue,
      codigo_descricao: 101,
      ValorAPagar: totalValue,
      total_incidencia: 0,
      total_retencao: 0,
      CodigoMatricula: enrollmentCode,
      codigo_preinscricao: parseInt(profileData?.codigo_preinscricao!),
      Desconto: 0,
      totalIVA: 0,
      TotalMulta: 0,
      Descricao: description,
      tipo_documento_factura_id: 1,
      canal: 3,
      itens: [
        {
          CodigoProduto: serviceTypeCode,
          Quantidade: 1,
          preco: totalValue,
          Total: totalValue,
          valor_pago: totalValue,
          obs: description,
          taxaIva: 0,
          valorIva: 0,
          retencao: 0,
          incidencia: 0,
          valorDesconto: 0,
          descontoProduto: 0,
          mes: 'Outubro',
          multa: 0,
          mesTempId: 3,
          estado: 0,
          valorPago: totalValue,
          valorATransportar: 0,
          codigoFactura: 1023,
        },
      ],
      DataFactura: '2025-10-24T10:00:00.000Z',
    }
    await createInvoiceAsync(invoice)
  }
  const createMonthlyPayments = async (enrollmentCode: number) => {
    if (isMonthlyFeeValueErro) {
      throw new Error('Erro ao gerar as mensalidades')
    }
    const monthlyValue = monthlyFeeValue[0]
    const invoiceData : CreatePaymentReferenceBody = {
      amount: parseFloat(monthlyValue.preco),
      currency: 'AOA',
      description: 'Pagamento da mensalidade académica',
      enrollment: {
        CodigoMatricula: enrollmentCode,
        codigo_preinscricao: parseInt(profileData?.preEnrollmentCode!),
      },
      itens: [
        {
          CodigoProduto: parseInt(monthlyValue.codigo),
          Quantidade: 2,
          preco: parseFloat(monthlyValue.preco),
          Total: parseFloat(monthlyValue.preco),
          valor_pago: parseFloat(monthlyValue.preco),
          obs: 'Pagamento da propina do mês de Outubro.',
          taxaIva: 0,
          valorIva: 0,
          retencao: 0,
          incidencia: 0,
          valorDesconto: 0,
          descontoProduto: 0,
          mes: 'Outubro',
          multa: 0,
          mesTempId: 3,
          estado: 0,
          valorPago: 0,
          valorATransportar: 0,
          codigoFactura: 1023,
        },
      ],
    }
    createPaymentReference(invoiceData)
  }

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
    const response = await confirmNewStudentEnrollmentAsync(selectedSubjects)
    const enrollmentCode = response.Codigo_Matricula
    await createInvoiceWithPayload(
      'Inscrição de matrícula',
      11511,
      enrollmentCode,
    )
    createMonthlyPayments(enrollmentCode);
  }
  const confirmStudentEnrollment = async () => {
    // ====== 📚 NOVO ESTUDANTE ======
    if (isNewStudent) {
      if (!grades) {
        toast.error('Disciplinas obrigatórias não selecionadas.')
        return
      }
      await confirmNewStudentEnrollment(grades, selectedSubjects)
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
