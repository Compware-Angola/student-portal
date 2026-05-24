/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { useState, type ReactNode, useMemo } from 'react'
import { RegistrationsUCContext } from './registrations-uc.context'
import { toast } from 'sonner'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import type { Grade } from '@/types/grade'
import { useQueryCurriculumPlan } from '@/hooks/curriculum/use-query-curriculum-plan'
import type { SectionKey, SelectedSchedule } from '../types/registrations-uc'
import { useQueryCurriculumPlanPendents } from '@/hooks/curriculum/use-query-curriculum-plan-pendents'
import { useMutationConfirmOldStudentEnrollment } from '@/hooks/enrollment/use-mutation-confirm-old-student-enrollment'
import { useMutationCreateInvoice } from '@/hooks/invoice/use-mutation-create-invoice'
import type { CreateInvoiceBody } from '@/services/invoice/post-invoice.service'
import { useMutationCreatePaymentReferenceMensalidades } from '@/hooks/invoice/use-mutation-payment-monthly'
import type { CreatePaymentReferenceBody } from '@/services/invoice/post-invoice-monthly.service'
import { useQueryMonthlyFeesValue } from '@/hooks/finance/use-query-monthly-fee'
import { useQueryActivityAcademicConfirmationStudent } from '@/hooks/academic/use-quer-activity-academic-confirmation'
import { getEnrollmentStatus } from '@/utils'
import { useQueryCurrentAcademicYear } from '@/hooks/academic-year/use-query-current-academic-year'
import { useQueryStudentDashboardStatistics } from '@/hooks/statics/use-query-student-dashboard-statistics'
import { useQueryGetDebit } from '@/hooks/renegotiation/use-query-renegotiation'
import type { TypeServiceResponse } from '@/services/type-service/type-service.service'
import { useTypeServiceSingle } from '@/hooks/service/use-query-type-service'
import { SERVICE_TYPES } from '@/constants/service-type'
import { useQueryStudentSituation } from '@/hooks/student/use-query-student-situation'
import { useQueryPrazoMatricula } from '@/hooks/prazos-matriculas/use-query-prazos-matricula'
type ToggleState = {
  new: boolean
  pendents: boolean
}
type EnrollmentProviderProps = {
  children: ReactNode
}

export function RegistrationsUCProvider({ children }: EnrollmentProviderProps) {
  const [isExpanded, setIsExpanded] = useState<ToggleState>({
    new: true,
    pendents: true,
  })

  const {
    profileData,
    isLoading: isLoadingProfileData,
    isError: isErrorProfileData,
  } = useQueryProfile()

  const {
    data: currentAcademicYear,
    isError: isErrorAcademicYear,
    isLoading: isLoadingAcademmicYear,
  } = useQueryCurrentAcademicYear()
  const { data: debit, isLoading: isLoadingDebit } = useQueryGetDebit({
    type: '1',
    enrollmentCode: profileData?.codigo_matricula,
    preinscricao: profileData?.codigo_preinscricao,
  })

  const {data : prazosMatricula } = useQueryPrazoMatricula({
    anoLectivo: currentAcademicYear?.codigo
  })

  const { isLoading: isLoadingStudenttatistics, data: studentStatistics } =
    useQueryStudentDashboardStatistics(profileData?.enrollmentCode)

  const {
    data: pendentsGrades,
    isLoading: isLoadingStudentCurriculumPlanPendents,
    isError: isErrorStudentCurriculumPlanPendents,
  } = useQueryCurriculumPlanPendents({
    preEnrollmentCode: profileData?.preEnrollmentCode,
    semestre: prazosMatricula?.semestre
  })
  const { data: studentSituation } = useQueryStudentSituation({
    preErrolmentCode: profileData?.preEnrollmentCode,
  })
  const { data: confirmationNewStudent } =
    useQueryActivityAcademicConfirmationStudent({
      academicYearCode: currentAcademicYear?.codigo ?? '23',
      candidacyType: profileData?.codigo_tipo_candidatura,
      type: 'old',
    })
  const generateClasse = useMemo(() => {
    const classe = profileData?.confirmacoes?.[0]?.classe
    const newClass = Number(classe) + 1
   // return `${newClass > 5 ? classe : newClass}`
   return newClass > 5 ? classe : newClass
  }, [profileData])

  const {
    data: grades,
    isLoading: isLoadingStudentCurriculumPlan,
    isError: isErrorStudentCurriculumPlan,
  
  } = useQueryCurriculumPlan({
    class: generateClasse,
    course: profileData?.codigo_curso,
    semestre: prazosMatricula?.semestre,
    type: "old"
  })
  
  const { data: foraPrazo } = useTypeServiceSingle({
    currentYearCode: Number(currentAcademicYear?.codigo),
    ...SERVICE_TYPES.INSCRICAO_FORA_PRAZO,
  })

  const enrollmentStatus = useMemo(
    () => getEnrollmentStatus(confirmationNewStudent[0]),
    [confirmationNewStudent],
  )
  const { createPaymentReference } =
    useMutationCreatePaymentReferenceMensalidades()

  const { data: monthlyFeeValue, isError: isMonthlyFeeValueErro } =
    useQueryMonthlyFeesValue({
      curso: profileData?.codigo_curso,
      polo: profileData?.poloid,
      anoLetivo: currentAcademicYear?.codigo ? parseInt(currentAcademicYear?.codigo!) : 23
    })

  const { createInvoiceAsync } = useMutationCreateInvoice()

  const {
    confirmOldStudentEnrollmentAsync,
    confirmOldStudentEnrollmentPending,
  } = useMutationConfirmOldStudentEnrollment()

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
    const alreadySelected = selectedSubjects.some(
      (s) => s.codigoGrade === subject.codigoGrade,
    )

    if (alreadySelected) {
      // Remove o horário vinculado
      removeScheduleForSubject(subject.codigoGrade)

      setSelectedSubjects((prev) =>
        prev.filter((s) => s.codigoGrade !== subject.codigoGrade),
      )

      return
    }

    if (selectedSubjects.length >= maxCourseGrade) {
      toast.error('Você já atingiu o número máximo de disciplinas permitidas.')
      return
    }

    setSelectedSubjects((prev) => [...prev, subject])
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
        codigoGrade: parseInt (subject.codigoGrade),
        codigoHorario:parseInt ( horario?.codigoHorario) || null,
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

    if (allSelected) {
      setSelectedSubjects([])
      toast.info('Todas as disciplinas foram desmarcadas.')
      return
    }

    const totalToSelect = allSubjects.length

    if (totalToSelect > maxCourseGrade) {
      toast.error(
        `Você pode selecionar no máximo ${maxCourseGrade} disciplinas.`,
      )
      return
    }

    setSelectedSubjects(allSubjects)
    toast.success('Todas as disciplinas foram selecionadas.')
  }

  const remove = (codigoGrade: string) => {
    const subject = selectedSubjects.find((s) => s.codigoGrade === codigoGrade)
    if (subject) toggleSubject(subject)
  }

  const removeAll = () => {
    setSelectedSubjects([])
  }

  const totalValue = selectedSubjects.reduce(
    (sum, s) => sum + parseInt(s.valorInscricao),
    0,
  )
  const foraPrazoValue =
    enrollmentStatus === 'closed' ? (foraPrazo?.preco ?? 0) : 0

  const totalPagar = totalValue + foraPrazoValue
  const createInvoiceWithPayload = async (enrollmentCode: number) => {
    if (!profileData) {
      throw new Error('dados do perfil nao encontrado')
    }
    const now = new Date()
    const itens = [
      ...(enrollmentStatus === 'closed' && foraPrazo
        ? [createItem(foraPrazo)]
        : []),

      ...selectedSubjects.map(generateDisciplineItem),
    ]
    const invoice: CreateInvoiceBody = {
      polo_id: profileData?.poloid ?? 1,
      TotalPreco: totalPagar,
      codigo_descricao: 101,
      ValorAPagar: totalPagar,
      total_incidencia: 0,
      total_retencao: 0,
      CodigoMatricula: enrollmentCode,
      codigo_preinscricao: profileData.codigo_preinscricao,
      Desconto: 0,
      totalIVA: 0,
      TotalMulta: 0,
      Descricao: 'Inscrição em uc + Inscrição em Disciplinas'.substring(0, 44),
      tipo_documento_factura_id: 1,
      canal: 3,
      DataFactura: now.toISOString(),
      itens: itens,
    }
    await createInvoiceAsync(invoice)
  }

  const createMonthlyPayments = async (enrollmentCode: number) => {
    if (isMonthlyFeeValueErro) {
      throw new Error('Erro ao gerar as mensalidades')
    }
    const monthlyValue = monthlyFeeValue[0]
    if (!profileData) {
      throw new Error('profile data nont found')
    }
    const invoiceData: CreatePaymentReferenceBody = {
      amount: parseFloat(monthlyValue.preco),
      currency: 'AOA',
      description: 'Pagamento da mensalidade académica',
      enrollment: {
        CodigoMatricula: enrollmentCode,
        codigo_preinscricao: parseInt(profileData?.preEnrollmentCode),
      },
      itens: [
        {
          CodigoProduto: parseInt(monthlyValue.codigo),
          Quantidade: 2,
          preco: parseFloat(monthlyValue.preco),
          Total: parseFloat(monthlyValue.preco),
          valor_pago: parseFloat(monthlyValue.preco),
          obs: '',
          taxaIva: 0,
          valorIva: 0,
          retencao: 0,
          incidencia: 0,
          valorDesconto: 0,
          descontoProduto: 0,
          mes: '',
          multa: 0,
          mesTempId: 0,
          estado: 0,
          valorPago: 0,
          valorATransportar: 0,
          codigoFactura: 1023,
        },
      ],
    }
    createPaymentReference(invoiceData)
  }

  const confirmStudentEnrollment = async () => {
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
    function delay(ms: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, ms))
    }
    const payload = getOldStudentEnrollmentPayload()
    await confirmOldStudentEnrollmentAsync({
      selectedGrades: payload.selectedGrades,
      semestre: prazosMatricula?.semestre!
    })
    delay(6000)
    await createInvoiceWithPayload(Number(profileData?.codigo_matricula!))
    createMonthlyPayments(Number(profileData?.codigo_matricula!))
  }

  return (
    <RegistrationsUCContext.Provider
      value={{
        foraPrazoValue,
        totalPagar,
        selectedSubjects,
        isErrorProfileData,
        isErrorStudentCurriculumPlan,
        isErrorStudentCurriculumPlanPendents,
        isLoadingProfileData,
        isLoadingStudentCurriculumPlan,
        isLoadingStudentCurriculumPlanPendents,
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
        confirmStudentEnrollmentState: confirmOldStudentEnrollmentPending,
        removeScheduleForSubject,
        selectScheduleForSubject,
        selectedSchedules,
        enrollmentStatus,
        isLoadingAcademmicYear,
        isErrorAcademicYear,
        isLoadingStudenttatistics,
        studentStatistics,
        profileData,
        maxCourseGrade,
        isLoadingDebit,
        studentSituation,
        debit,
        semestreActual: prazosMatricula?.semestre
      }}
    >
      {children}
    </RegistrationsUCContext.Provider>
  )
}

function generateDisciplineItem(grade: Grade) {
  const MAX_OBS_LENGTH = 45
  const nomeCompleto =
    grade.disciplina || grade.codigoDisciplina || 'Disciplina'

  const prefixo = 'Insc. '
  let obs = prefixo + nomeCompleto

  if (obs.length > MAX_OBS_LENGTH) {
    const espacoParaNome = MAX_OBS_LENGTH - prefixo.length - 3 // -3 para ...
    const nomeCortado = nomeCompleto.substring(0, espacoParaNome)
    obs = prefixo + nomeCortado + '...'
  }

  // Garantia absoluta: nunca mais de 45
  obs = obs.substring(0, MAX_OBS_LENGTH)

  return {
    CodigoProduto: 11476,
    Quantidade: 1,
    preco: Number(grade.valorInscricao),
    Total: Number(grade.valorInscricao),
    valor_pago: 0,
    obs: obs,
    taxaIva: 1,
    valorIva: 0,
    retencao: 0,
    incidencia: 0,
    valorDesconto: 0,
    descontoProduto: 0,
    mes: '',
    multa: 0,
    estado: 0,
    valorPago: 0,
    valorATransportar: 0,
  }
}
function createItem(serviceType: TypeServiceResponse) {
  const MAX_OBS_LENGTH = 45

  return {
    CodigoProduto: serviceType.codigo,
    Quantidade: 1,
    preco: serviceType.preco,
    Total: serviceType.preco,
    valor_pago: 0,
    obs: serviceType?.descricao?.substring(0, MAX_OBS_LENGTH) ?? '',
    taxaIva: 1,
    valorIva: 0,
    retencao: 0,
    incidencia: 0,
    valorDesconto: 0,
    descontoProduto: 0,
    mes: '',
    multa: 0,
    estado: 0,
    valorPago: 0,
    valorATransportar: 0,
  }
}
