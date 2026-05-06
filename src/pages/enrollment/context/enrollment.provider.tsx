import { useState, type ReactNode, useMemo, useEffect } from 'react'
import { EnrollmentContext } from './enrollment.context'
import { toast } from 'sonner'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useMutationConfirmNewStudentEnrollment } from '@/hooks/enrollment/use-mutation-confirm-new-student-enrollment'
import type { Grade } from '@/types/grade'
import { useQueryCurriculumPlan } from '@/hooks/curriculum/use-query-curriculum-plan'
import type { SectionKey, SelectedSchedule } from '../types/enrollment'

import { useMutationCreateInvoice } from '@/hooks/invoice/use-mutation-create-invoice'
import type { CreateInvoiceBody } from '@/services/invoice/post-invoice.service'
import { useMutationCreatePaymentReferenceMensalidades } from '@/hooks/invoice/use-mutation-payment-monthly'
import type { CreatePaymentReferenceBody } from '@/services/invoice/post-invoice-monthly.service'
import { useQueryMonthlyFeesValue } from '@/hooks/finance/use-query-monthly-fee'
import { useQueryStudentSituation } from '@/hooks/student/use-query-student-situation'
import { StudentSituation } from '@/constants/student-situation'
import { useQueryActivityAcademicConfirmationStudent } from '@/hooks/academic/use-quer-activity-academic-confirmation'
import { getEnrollmentStatus } from '@/utils'
import { useQueryCurrentAcademicYear } from '@/hooks/academic-year/use-query-current-academic-year'
import { useQueryStudentDashboardStatistics } from '@/hooks/statics/use-query-student-dashboard-statistics'
import { useTypeServiceSingle } from '@/hooks/service/use-query-type-service'
import { SERVICE_TYPES } from '@/constants/service-type'
import type { TypeServiceResponse } from '@/services/type-service/type-service.service'

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
  // Busaca de dados
  const {
    profileData,
    isLoading: isLoadingProfileData,
    isError: isErrorProfileData,
  } = useQueryProfile()

  const { data: studentSituation } = useQueryStudentSituation({
    preErrolmentCode: profileData?.preEnrollmentCode,
  })
  const {
    data: currentAcademicYear,
    isError: isErrorAcademicYear,
    isLoading: isLoadingAcademmicYear,
  } = useQueryCurrentAcademicYear()

  const { data: taxaMatricula } = useTypeServiceSingle({
    currentYearCode: Number(currentAcademicYear?.codigo),
    ...SERVICE_TYPES.TAXA_MATRICULA,
  })

  const { data: foraPrazo } = useTypeServiceSingle({
    currentYearCode: Number(currentAcademicYear?.codigo),
    ...SERVICE_TYPES.INSCRICAO_FORA_PRAZO,
  })

  const { isLoading: isLoadingStudenttatistics, data: studentStatistics } =
    useQueryStudentDashboardStatistics(profileData?.enrollmentCode)

  const isNewStudentWithOutEnrollment =
    StudentSituation.NEW_WITHOUT_ENROLLMENT ===
    Number(studentSituation?.codigo_status)

  const { data: confirmationNewStudent } =
    useQueryActivityAcademicConfirmationStudent({
      academicYearCode: currentAcademicYear?.codigo,
      candidacyType: profileData?.codigo_tipo_candidatura,
      type: 'new',
    })

  const {
    data: grades,
    isLoading: isLoadingStudentCurriculumPlan,
    isError: isErrorStudentCurriculumPlan,
  } = useQueryCurriculumPlan({
    class: '1',
    course: profileData?.codigo_curso,
    type:"new"
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
      polo: profileData?.poloId,
      anoLetivo: currentAcademicYear?.codigo ?? '23',
    })

  const {
    confirmNewStudentEnrollmentPending,
    confirmNewStudentEnrollmentAsync,
  } = useMutationConfirmNewStudentEnrollment()

  const { createInvoiceAsync } = useMutationCreateInvoice()

  // Horários selecionados por disciplina (mapeados pelo código da grade)
  const [selectedSchedules, setSelectedSchedules] = useState<
    Record<string, SelectedSchedule>
  >({})

  const [selectedSubjects, setSelectedSubjects] = useState<Grade[]>([])
  useEffect(() => {
    if (grades?.length > 0 && selectedSubjects.length === 0) {
      setSelectedSubjects([...grades])
    }
  }, [grades, selectedSubjects.length])

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
    const all = [...grades]
    return (
      all.length > 0 &&
      all.every((s) =>
        selectedSubjects.some((x) => x.codigoGrade === s.codigoGrade),
      )
    )
  }
  const toggleSubject = (subject: Grade) => {
    // 🔒 Impede modificações se for novo estudante sem matrícula
    if (isNewStudentWithOutEnrollment) {
      toast.warning('Novo estudante não pode remover disciplinas obrigatórias.')
      return
    }

    // 🔍 Verifica se já está selecionada
    const alreadySelected = selectedSubjects.some(
      (s) => s.codigoGrade === subject.codigoGrade,
    )

    // ✅ Caso esteja selecionada → o usuário quer desmarcar
    if (alreadySelected) {
      // Remove o horário vinculado
      removeScheduleForSubject(subject.codigoGrade)

      // Atualiza a lista removendo o item
      setSelectedSubjects((prev) =>
        prev.filter((s) => s.codigoGrade !== subject.codigoGrade),
      )

      return
    }

    // 🚫 Impede selecionar se já atingiu o máximo permitido
    if (selectedSubjects.length >= maxCourseGrade) {
      toast.error('Você já atingiu o número máximo de disciplinas permitidas.')
      return
    }

    // ✅ Caso contrário, adiciona normalmente
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

  const selectAll = () => {
    const allSubjects = [...grades]
    const allSelected = isAllSelected()

    if (isNewStudentWithOutEnrollment) {
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

    // ✅ Caso esteja dentro do limite → seleciona todas
    setSelectedSubjects(allSubjects)
    toast.success('Todas as disciplinas foram selecionadas.')
  }

  const remove = (codigoGrade: string) => {
    const subject = selectedSubjects.find((s) => s.codigoGrade === codigoGrade)
    if (subject) toggleSubject(subject)
  }

  const removeAll = () => {
    if (isNewStudentWithOutEnrollment) {
      toast.warning('Novo estudante não pode remover disciplinas obrigatórias.')
      return
    }
    setSelectedSubjects([])
  }

  const totalValue = selectedSubjects.reduce(
    (sum, s) => sum + parseInt(s.valorInscricao),
    0,
  )

  const taxaMatriculaValue = taxaMatricula?.preco ?? 0
  const foraPrazoValue =
    enrollmentStatus === 'closed' ? (foraPrazo?.preco ?? 0) : 0

  const totalPagar = totalValue + taxaMatriculaValue + foraPrazoValue
  const createInvoiceWithPayload = async (enrollmentCode: number) => {
    if (!profileData) {
      throw new Error('dados do perfil nao encontrado')
    }
    const now = new Date()

    const itens = [
      ...(enrollmentStatus === 'closed' && foraPrazo
        ? [createItem(foraPrazo)]
        : []),
      createItem(taxaMatricula!),
      ...selectedSubjects.map(generateDisciplineItem),
    ]
    const invoice: CreateInvoiceBody = {
      polo_id: profileData?.poloid,
      TotalPreco: totalPagar,
      codigo_descricao: 101,
      ValorAPagar: totalPagar,
      total_incidencia: 0,
      total_retencao: 0,
      CodigoMatricula: enrollmentCode,
      codigo_preinscricao: profileData.codigo_preinscricao!,
      Desconto: 0,
      totalIVA: 0,
      TotalMulta: 0,
      Descricao: 'Matrícula + Inscrição em Disciplinas'.substring(0, 44),
      tipo_documento_factura_id: 1,
      canal: 3,
      DataFactura: now.toISOString(),
      itens: itens,
    }

    return createInvoiceAsync(invoice)
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

  function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  const confirmStudentEnrollment = async () => {
    const isSelectedAllSubjects = grades.length === selectedSubjects.length

    if (!isSelectedAllSubjects) {
      toast.warning('Selecione todas as disciplinas obrigatórias.')
      return
    }
    const response = await confirmNewStudentEnrollmentAsync(selectedSubjects)
    console.log(response.data.codMatricula)
    const enrollmentCode =  response.data.codMatricula //response.Codigo_Matricula
    await delay(6000)
    const responseInvoice = await createInvoiceWithPayload(enrollmentCode)
    if (responseInvoice) {
      await createMonthlyPayments(enrollmentCode)
    }
  }

  return (
    <EnrollmentContext.Provider
      value={{
        taxaMatriculaValue,
        foraPrazoValue,
        totalPagar,
        selectedSubjects,
        isErrorProfileData,
        isErrorStudentCurriculumPlan,
        isLoadingProfileData,
        isLoadingStudentCurriculumPlan,
        isExpanded,
        subject: grades ?? [],
        totalValue,
        toggleSubject,
        isSelected,
        toggleSection,
        selectAll,
        isAllSelected,
        remove,
        removeAll,
        confirmStudentEnrollment,
        confirmStudentEnrollmentState: confirmNewStudentEnrollmentPending,
        removeScheduleForSubject,
        selectScheduleForSubject,
        selectedSchedules,
        isNewStudentWithOutEnrollment,
        studentSituation: studentSituation,
        enrollmentStatus,
        isLoadingAcademmicYear,
        isErrorAcademicYear,
        isLoadingStudenttatistics,
        studentStatistics,
        profileData,
        maxCourseGrade,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
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
    mesTempId: 3,
    estado: 0,
    valorPago: 0,
    valorATransportar: 0,
  }
}
