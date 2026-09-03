
import { useState, type ReactNode, useMemo } from 'react'
import { toast } from 'sonner'
import { RegistrationsUCContext } from './registrations-uc.context'
import type { Grade } from '@/types/grade'
import type { SectionKey, SelectedSchedule } from '../types/registrations-uc'
import type { CreateInvoiceBody } from '@/services/invoice/post-invoice.service'
import type { TypeServiceResponse } from '@/services/type-service/type-service.service'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useFetchQueryCurriculum } from '@/hooks/curriculum/use-query-curriculum-plan'
import { useMutationConfirmOldStudentEnrollment } from '@/hooks/enrollment/use-mutation-confirm-old-student-enrollment'
import { useMutationCreateInvoice } from '@/hooks/invoice/use-mutation-create-invoice'
import { useQueryCurrentAcademicYear } from '@/hooks/academic-year/use-query-current-academic-year'
import { useQueryGetDebit } from '@/hooks/renegotiation/use-query-renegotiation'
import { useTypeServiceSingle } from '@/hooks/service/use-query-type-service'
import { useQueryConfirmation } from '@/hooks/student/use-query-confirmation'
import { useGradeMapper } from '../hooks/use-grade-mapper'
import { getEnrollmentStatus, parseFilter } from '@/utils'
import { SERVICE_TYPES } from '@/constants/service-type'
import { UseQueryEnrollmentAndRegistrationDeadlines } from '@/hooks/enrollment-and-registration-deadlines/use-query-enrollment-and-registration-deadlines'

type ToggleState = {
  new: boolean
  pendents: boolean
}

type EnrollmentProviderProps = {
  children: ReactNode
}

interface Prazo {
  data_inicio: string
  data_termino: string
}

// =====================
// 📅 Utilitário de prazo
// =====================
function getStatusPrazo(calendario?: Prazo[]) {
  const agora = new Date()

  if (!calendario || calendario.length === 0) {
    return { prazoValido: false, foraDoPrazo: false, aindaNaoComecou: false }
  }

  const prazoValido = calendario.some(
    (p) => new Date(p.data_inicio) <= agora && new Date(p.data_termino) >= agora,
  )

  const foraDoPrazo =
    !prazoValido && calendario.some((p) => new Date(p.data_termino) < agora)

  const aindaNaoComecou = !prazoValido && !foraDoPrazo

  return { prazoValido, foraDoPrazo, aindaNaoComecou }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function RegistrationsUCProvider({ children }: EnrollmentProviderProps) {
  // =====================
  // 🔀 Estado local (UI)
  // =====================
  const [isExpanded, setIsExpanded] = useState<ToggleState>({
    new: true,
    pendents: true,
  })
  const [selectedSchedules, setSelectedSchedules] = useState<Record<string, SelectedSchedule>>({})
  const [selectedSubjects, setSelectedSubjects] = useState<Grade[]>([])

  // =====================
  // 📡 Queries
  // =====================
  const {
    profileData,
    isLoading: isLoadingProfileData,
    isError: isErrorProfileData,
  } = useQueryProfile()

  const {
    data: currentAcademicYear,
    isError: isErrorAcademicYear,
    isLoading: isLoadingAcademmicYear,
  } = useQueryCurrentAcademicYear(profileData?.codigo_tipo_candidatura)



  const { data: enrollmentPeriodStudentsOld } = UseQueryEnrollmentAndRegistrationDeadlines({
    anoLectivo: parseFilter(currentAcademicYear?.codigo?.toString()),
    isNewStudent: 0,
    codigoTipoCandidatura: profileData?.codigo_tipo_candidatura,
    
  })
  const { data: debit, isLoading: isLoadingDebit } = useQueryGetDebit({
    type: '1',
    enrollmentCode: profileData?.codigo_matricula,
    preinscricao: profileData?.codigo_preinscricao,
    enabled:!!enrollmentPeriodStudentsOld?.calendario?.length && !!profileData?.codigo_matricula
  })


  const {
    data: curriculumPlan,
    isLoading: isLoadingCurriculumPlan,
    isError: isErrorCurriculumPlan,
    error: curriculumPlanError,
  } = useFetchQueryCurriculum({
    academicYear: currentAcademicYear?.codigo?.toString()!,
    enrollmentCode: profileData?.codigo_matricula!,
    newStudent: false,
    semestre: currentAcademicYear?.semestre!,
  })

  // Serviço/taxa cobrado quando a confirmação acontece fora do prazo
  const { data: lateConfirmationService } = useTypeServiceSingle({
    currentYearCode: Number(currentAcademicYear?.codigo),
    ...SERVICE_TYPES.INSCRICAO_FORA_PRAZO,
  })

  const {
    data: confirmationData,
    isLoading: isLoadingConfirmation,
    isError: isErrorConfirmation,
  } = useQueryConfirmation({
    studentId: Number(profileData?.enrollmentCode!),
    academicYearCode: currentAcademicYear?.codigo!,
    semesterCode: currentAcademicYear?.semestre!,
  })

  // =====================
  // 🧮 Mutations
  // =====================
  const { createInvoiceAsync } = useMutationCreateInvoice()
  const {
    confirmOldStudentEnrollmentAsync,
    confirmOldStudentEnrollmentPending,
  } = useMutationConfirmOldStudentEnrollment()

  // =====================
  // 🧠 Valores derivados
  // =====================
  const { mapGrades } = useGradeMapper(Number(currentAcademicYear?.codigo))
  const pendentsGrades = mapGrades(curriculumPlan?.gradesPendentes ?? [])
  const grades = mapGrades(curriculumPlan?.gradesAFazer ?? [])

  const maxCourseGrade = Math.floor(Number(profileData?.max_cadeiras_curso)/2)

  // Status "textual" da inscrição (usado no badge da UI)
  const enrollmentStatus = useMemo(
    () => getEnrollmentStatus(enrollmentPeriodStudentsOld),
    [enrollmentPeriodStudentsOld],
  )

  // Fonte da verdade sobre o prazo: calendário real de confirmação
  const { prazoValido, foraDoPrazo, aindaNaoComecou } = useMemo(
    () => getStatusPrazo(enrollmentPeriodStudentsOld?.calendario),
    [enrollmentPeriodStudentsOld],
  )

  // Aplica a taxa de fora do prazo com base no calendário real (não no enrollmentStatus)
  const lateConfirmationValue = foraDoPrazo ? lateConfirmationService?.preco ?? 0 : 0

  const totalValue = selectedSubjects.reduce(
    (sum, s) => sum + parseInt(s.valorInscricao),
    0,
  )

  const totalPagar = totalValue + lateConfirmationValue

  // =====================
  // 🧩 Helpers de seleção
  // =====================
  const toggleSection = (section: SectionKey) => {
    setIsExpanded((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const isSelected = (subject: Grade) =>
    selectedSubjects.some((s) => s.codigoGrade === subject.codigoGrade)

  const isAllSelected = () => {
    const all = [...grades, ...pendentsGrades]
    return (
      all.length > 0 &&
      all.every((s) => selectedSubjects.some((x) => x.codigoGrade === s.codigoGrade))
    )
  }

  // Pendentes ainda por selecionar — enquanto existirem, o aluno não pode
  // inscrever cadeiras novas (regra do negócio: finalizar pendentes primeiro).
  const unselectedPendents = pendentsGrades.filter(
    (p) => !selectedSubjects.some((s) => s.codigoGrade === p.codigoGrade),
  )
  const hasUnselectedPendents = unselectedPendents.length > 0

  const isNewSubject = (codigoGrade: string) =>
    grades.some((g) => g.codigoGrade === codigoGrade)

  const PENDING_FIRST_MESSAGE =
    'Finalize as disciplinas pendentes antes de adicionar novas cadeiras.'

  // A confirmação da matrícula só é permitida quando todas as pendentes
  // possíveis já estão selecionadas: ou não sobram pendentes, ou a quota
  // (maxCourseGrade) já está cheia — nesse caso as restantes ficam para a
  // próxima inscrição.
  const mustSelectMorePendents =
    hasUnselectedPendents && selectedSubjects.length < maxCourseGrade

  const PENDING_CONFIRM_MESSAGE =
    'Selecione todas as disciplinas pendentes antes de confirmar a matrícula.'

  const toggleSubject = (subject: Grade) => {
    const alreadySelected = isSelected(subject)

    if (alreadySelected) {
      removeScheduleForSubject(subject.codigoGrade)
      setSelectedSubjects((prev) =>
        prev.filter((s) => s.codigoGrade !== subject.codigoGrade),
      )
      return
    }

    if (hasUnselectedPendents && isNewSubject(subject.codigoGrade)) {
      toast.warning(PENDING_FIRST_MESSAGE)
      return
    }

    if (selectedSubjects.length >= maxCourseGrade) {
      toast.error('Você já atingiu o número máximo de disciplinas permitidas.')
      return
    }

    setSelectedSubjects((prev) => [...prev, subject])
  }

  const selectAll = () => {
    const allSubjects = [...grades, ...pendentsGrades]
    const allSelected = isAllSelected()

    if (allSelected) {
      setSelectedSubjects([])
      setSelectedSchedules({})
      toast.info('Todas as disciplinas foram desmarcadas.')
      return
    }

    if (allSubjects.length > maxCourseGrade) {
      toast.error(`Você pode selecionar no máximo ${maxCourseGrade} disciplinas.`)
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
    setSelectedSchedules({})
  }

  const selectScheduleForSubject = (
    codigoGrade: string,
    horario: SelectedSchedule,
  ) => {
    const alreadySelected = selectedSubjects.some(
      (s) => s.codigoGrade === codigoGrade,
    )

    // Ao escolher/trocar um horário garantimos que a disciplina fica
    // selecionada. Nunca alternamos aqui, para não desmarcar uma UC já
    // escolhida quando o utilizador apenas muda de horário.
    if (
      !alreadySelected &&
      hasUnselectedPendents &&
      isNewSubject(codigoGrade)
    ) {
      toast.warning(PENDING_FIRST_MESSAGE)
      return
    }

    if (!alreadySelected && selectedSubjects.length >= maxCourseGrade) {
      toast.error('Você já atingiu o número máximo de disciplinas permitidas.')
      return
    }

    setSelectedSchedules((prev) => ({ ...prev, [codigoGrade]: horario }))

    if (!alreadySelected) {
      const subject = [...grades, ...pendentsGrades].find(
        (g) => g.codigoGrade === codigoGrade,
      )
      if (subject) {
        setSelectedSubjects((prev) => [...prev, subject])
      }
    }
  }

  const removeScheduleForSubject = (codigoGrade: string) => {
    setSelectedSchedules((prev) => {
      const updated = { ...prev }
      delete updated[codigoGrade]
      return updated
    })
  }

  // =====================
  // 📦 Payload / Fatura
  // =====================
  const getOldStudentEnrollmentPayload = () => {
    if (!profileData?.enrollmentCode) {
      throw new Error('Enrollment code is missing')
    }

    const selectedGrades = selectedSubjects.map((subject) => {
      const horario = selectedSchedules[subject.codigoGrade]
      return {
        codigoGrade: parseInt(subject.codigoGrade),
        codigoHorario: horario?.codigoHorario ? parseInt(horario.codigoHorario) : null,
        descHorario: horario?.descHorario || '',
      }
    })

    return { enrollmentCode: profileData.enrollmentCode, selectedGrades }
  }

  const createInvoiceWithPayload = async (enrollmentCode: number) => {
    if (!profileData) {
      throw new Error('dados do perfil nao encontrado')
    }
    if (!currentAcademicYear?.codigo) {
      throw new Error('ano lectivo não encontrado')
    }

    const itens = [
      // Taxa de inscrição fora do prazo, quando aplicável
      ...(foraDoPrazo && lateConfirmationService
        ? [createServiceItem(lateConfirmationService)]
        : []),
      ...selectedSubjects.map((subject) =>
        generateDisciplineItem(subject, currentAcademicYear.codigo),
      ),
    ]

    const invoice: CreateInvoiceBody = {
      polo_id: profileData.poloid ?? 1,
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
      codigo_anoLectivo: currentAcademicYear.codigo,
      Descricao: 'Inscrição em uc + Inscrição em Disciplinas'.substring(0, 44),
      tipo_documento_factura_id: 1,
      canal: 3,
      DataFactura: new Date().toISOString(),
      itens,
    }

    await createInvoiceAsync(invoice)
  }

  // =====================
  // ✅ Confirmação de matrícula
  // =====================
  const confirmStudentEnrollment = async () => {
    if (selectedSubjects.length === 0) {
      toast.warning('Nenhuma disciplina selecionada.')
      return
    }

    if (selectedSubjects.length > maxCourseGrade) {
      toast.error(`Não é permitido ultrapassar ${maxCourseGrade} disciplinas.`)
      return
    }

    if (mustSelectMorePendents) {
      toast.warning('Ainda há disciplinas pendentes não selecionadas.', {
        description: PENDING_CONFIRM_MESSAGE,
      })
      return
    }

    const selectedNews = grades.filter((g) =>
      selectedSubjects.some((s) => s.codigoGrade === g.codigoGrade),
    )

    if (hasUnselectedPendents && selectedNews.length > 0) {
      toast.warning('Ainda há disciplinas pendentes não selecionadas.', {
        description: PENDING_FIRST_MESSAGE,
      })
      return
    }

    const missingSchedules = selectedSubjects.filter(
      (subject) => !selectedSchedules[subject.codigoGrade]?.codigoHorario,
    )

    if (missingSchedules.length > 0) {
      const missingNames = missingSchedules.map((s) => s.disciplina).join(', ')
      toast.warning(`Selecione o horário para: ${missingNames}`, {
        description: 'Cada disciplina precisa ter um horário definido antes de continuar.',
      })
      return
    }

    if (!currentAcademicYear?.semestre || !currentAcademicYear?.codigo) {
      toast.error('Ano lectivo não encontrado.')
      return
    }
    if (!profileData?.codigo_matricula) {
      toast.error('Matrícula não encontrada.')
      return
    }

    const payload = getOldStudentEnrollmentPayload()

    await confirmOldStudentEnrollmentAsync({
      selectedGrades: payload.selectedGrades,
      semestre: currentAcademicYear.semestre,
      anoLectivo: currentAcademicYear.codigo,
    })

    await delay(6000)
    await createInvoiceWithPayload(Number(profileData.codigo_matricula))
  }

  // =====================
  // 🧾 Contexto exposto
  // =====================
  return (
    <RegistrationsUCContext.Provider
      value={{
        // Taxa / prazo
        LateConfirmationValue: lateConfirmationValue,
        LateConfirmation: lateConfirmationService,
        prazoValido,
        foraDoPrazo,
        aindaNaoComecou,
       
        enrollmentPeriodStudentsOld,

        // Totais
        totalPagar,
        totalValue,

        // Disciplinas
        selectedSubjects,
        subject: grades,
        pendingSubjects: pendentsGrades,
        toggleSubject,
        isSelected,
        selectAll,
        isAllSelected,
        remove,
        removeAll,
        hasUnselectedPendents,
        mustSelectMorePendents,

        // Horários
        selectedSchedules,
        selectScheduleForSubject,
        removeScheduleForSubject,

        // UI
        isExpanded,
        toggleSection,

        // Confirmação
        confirmStudentEnrollment,
        confirmStudentEnrollmentState: confirmOldStudentEnrollmentPending,
        confirmationData,
        isLoadingConfirmation,
        isErrorConfirmation,
        enrollmentStatus,

        // Loading / erro
        isErrorProfileData,
        isErrorStudentCurriculumPlan: isErrorCurriculumPlan,
        isErrorStudentCurriculumPlanPendents: isErrorCurriculumPlan,
        curriculumPlanError,
        isLoadingProfileData,
        isLoadingStudentCurriculumPlan: isLoadingCurriculumPlan,
        isLoadingStudentCurriculumPlanPendents: isLoadingCurriculumPlan,
        isLoadingAcademmicYear,
        isErrorAcademicYear,
     
        isLoadingDebit,

        // Dados gerais
        profileData,
        maxCourseGrade,
      
      
        debit,
        semestreActual: currentAcademicYear?.semestre,
        curriculumPlan,
        currentAcademicYear: currentAcademicYear?.codigo!,
      }}
    >
      {children}
    </RegistrationsUCContext.Provider>
  )
}

// =====================
// 🧱 Builders de item de fatura
// =====================
function generateDisciplineItem(grade: Grade, currentAcademicYear: number) {
  const MAX_OBS_LENGTH = 45
  const nomeCompleto = grade.disciplina || grade.codigoDisciplina || 'Disciplina'
  const prefixo = 'Insc. '

  let obs = prefixo + nomeCompleto
  if (obs.length > MAX_OBS_LENGTH) {
    const espacoParaNome = MAX_OBS_LENGTH - prefixo.length - 3 // -3 para "..."
    obs = prefixo + nomeCompleto.substring(0, espacoParaNome) + '...'
  }
  obs = obs.substring(0, MAX_OBS_LENGTH)

  return {
    CodigoProduto: Number(grade.codigoProduto),
    Quantidade: 1,
    preco: Number(grade.valorInscricao),
    Total: Number(grade.valorInscricao),
    valor_pago: 0,
    obs,
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
    codigo_anoLectivo: currentAcademicYear,
  }
}

function createServiceItem(serviceType: TypeServiceResponse) {
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