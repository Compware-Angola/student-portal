import { useState, type ReactNode, useMemo, useEffect } from 'react'
import { toast } from 'sonner'

import { EnrollmentContext } from './enrollment.context'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useMutationConfirmNewStudentEnrollment } from '@/hooks/enrollment/use-mutation-confirm-new-student-enrollment'
import { useFetchQueryCurriculum } from '@/hooks/curriculum/use-query-curriculum-plan'
import { useMutationCreateInvoice } from '@/hooks/invoice/use-mutation-create-invoice'
import { useQueryCurrentAcademicYear } from '@/hooks/academic-year/use-query-current-academic-year'
import { useQueryStudentDashboardStatistics } from '@/hooks/statics/use-query-student-dashboard-statistics'
import { useTypeServiceSingle } from '@/hooks/service/use-query-type-service'
import { useGradeMapper } from '@/pages/registrationsUC/hooks/use-grade-mapper'
import { UseQueryEnrollmentAndRegistrationDeadlines } from '@/hooks/enrollment-and-registration-deadlines/use-query-enrollment-and-registration-deadlines'

import { getEnrollmentStatus, parseFilter } from '@/utils'
import { SERVICE_TYPES } from '@/constants/service-type'

import type { Grade } from '@/types/grade'
import type { CreateInvoiceBody } from '@/services/invoice/post-invoice.service'
import type { TypeServiceResponse } from '@/services/type-service/type-service.service'
import type { SectionKey, SelectedSchedule } from '../types/enrollment'

const MAX_OBS_LENGTH = 45
const INVOICE_PROCESSING_DELAY_MS = 6000 // TODO: substituir por polling/callback do backend em vez de espera fixa

type ToggleState = {
  new: boolean
  pendents: boolean
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


type EnrollmentProviderProps = {
  children: ReactNode
}

export function EnrollmentProvider({ children }: EnrollmentProviderProps) {
  const [isExpanded, setIsExpanded] = useState<ToggleState>({
    new: true,
    pendents: true,
  })
  const [selectedSchedules, setSelectedSchedules] = useState<Record<string, SelectedSchedule>>({})
  const [selectedSubjects, setSelectedSubjects] = useState<Grade[]>([])

  // ----- Busca de dados -----
  const {
    profileData,
    isLoading: isLoadingProfileData,
    isError: isErrorProfileData,
  } = useQueryProfile()

  const {
    data: currentAcademicYear,
    isError: isErrorAcademicYear,
    isLoading: isLoadingAcademicYear,
  } = useQueryCurrentAcademicYear(profileData?.codigo_tipo_candidatura)

  const { data: taxaMatricula } = useTypeServiceSingle({
    currentYearCode: Number(currentAcademicYear?.codigo),
    ...SERVICE_TYPES.TAXA_MATRICULA,
  })

  const { data: foraPrazo } = useTypeServiceSingle({
    currentYearCode: Number(currentAcademicYear?.codigo),
    ...SERVICE_TYPES.INSCRICAO_FORA_PRAZO,
  })

  const { isLoading: isLoadingStudentStatistics, data: studentStatistics } =
    useQueryStudentDashboardStatistics(profileData?.enrollmentCode)

  const { mapGrades } = useGradeMapper(Number(currentAcademicYear?.codigo))

  const { data: enrollmentPeriod } = UseQueryEnrollmentAndRegistrationDeadlines({
    anoLectivo: parseFilter(currentAcademicYear?.codigo?.toString()),
    isNewStudent: 1,
    codigoTipoCandidatura: Number(profileData?.codigo_tipo_candidatura),
  })

  const {
    data: curriculumPlan,
    isLoading: isLoadingCurriculumPlan,
    isError: isErrorCurriculumPlan,
  } = useFetchQueryCurriculum({
    academicYear: currentAcademicYear?.codigo?.toString()!,
    preEnrollmentCode: Number(profileData?.preEnrollmentCode!),
    newStudent: true,
  })

  const grades = mapGrades(curriculumPlan?.gradesAFazer ?? [])

  const enrollmentStatus = useMemo(
    () => getEnrollmentStatus(enrollmentPeriod),
    [enrollmentPeriod],
  )
  // Fonte da verdade sobre o prazo: calendário real de confirmação
  const { prazoValido, foraDoPrazo, aindaNaoComecou } = useMemo(
    () => getStatusPrazo(enrollmentPeriod?.calendario),
    [enrollmentPeriod],
  )

  const { confirmNewStudentEnrollmentPending, confirmNewStudentEnrollmentAsync } =
    useMutationConfirmNewStudentEnrollment()

  const { createInvoiceAsync } = useMutationCreateInvoice()

  const maxCourseGrade = Number(profileData?.max_cadeiras_curso)

  // Pré-seleciona todas as disciplinas assim que a grade curricular chega
  useEffect(() => {
    if (grades.length > 0 && selectedSubjects.length === 0) {
      setSelectedSubjects([...grades])
    }
  }, [grades, selectedSubjects.length])

  // ----- Seleção de disciplinas -----

  const toggleSection = (section: SectionKey) => {
    setIsExpanded((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const isSelected = (subject: Grade) =>
    selectedSubjects.some((s) => s.codigoGrade === subject.codigoGrade)

  const isAllSelected = () =>
    grades.length > 0 &&
    grades.every((s) => selectedSubjects.some((x) => x.codigoGrade === s.codigoGrade))

  const removeScheduleForSubject = (codigoGrade: string) => {
    setSelectedSchedules((prev) => {
      const updated = { ...prev }
      delete updated[codigoGrade]
      return updated
    })
  }

  const selectScheduleForSubject = (codigoGrade: string, horario: SelectedSchedule) => {
    const alreadySelected = selectedSubjects.some(
      (s) => s.codigoGrade === codigoGrade,
    )

    // Escolher/trocar um horário garante que a disciplina fica selecionada.
    // Nunca alternamos aqui, para não desmarcar uma UC já escolhida quando o
    // utilizador apenas muda de horário.
    if (!alreadySelected && selectedSubjects.length >= maxCourseGrade) {
      toast.error('Você já atingiu o número máximo de disciplinas permitidas.')
      return
    }

    setSelectedSchedules((prev) => ({ ...prev, [codigoGrade]: horario }))

    if (!alreadySelected) {
      const subject = grades.find((g) => g.codigoGrade === codigoGrade)
      if (subject) {
        setSelectedSubjects((prev) => [...prev, subject])
      }
    }
  }

  const toggleSubject = (subject: Grade) => {
    const alreadySelected = isSelected(subject)

    if (alreadySelected) {
      removeScheduleForSubject(subject.codigoGrade)
      setSelectedSubjects((prev) => prev.filter((s) => s.codigoGrade !== subject.codigoGrade))
      return
    }

    if (selectedSubjects.length >= maxCourseGrade) {
      toast.error('Você já atingiu o número máximo de disciplinas permitidas.')
      return
    }

    setSelectedSubjects((prev) => [...prev, subject])
  }



  const selectAll = () => {
    if (isAllSelected()) {
      setSelectedSubjects([])
      setSelectedSchedules({})
      toast.info('Todas as disciplinas foram desmarcadas.')
      return
    }

    if (grades.length > maxCourseGrade) {
      toast.error(`Você pode selecionar no máximo ${maxCourseGrade} disciplinas.`)
      return
    }

    setSelectedSubjects(grades)
    toast.success('Todas as disciplinas foram selecionadas.')
  }

  // ----- Valores -----

  const totalValue = selectedSubjects.reduce((sum, s) => sum + Number(s.valorInscricao), 0)
  const taxaMatriculaValue = taxaMatricula?.preco ?? 0
  const foraPrazoValue = enrollmentStatus === 'closed' ? (foraPrazo?.preco ?? 0) : 0
  const totalPagar = totalValue + taxaMatriculaValue + foraPrazoValue

  // ----- Fatura -----

  const createInvoiceWithPayload = async (enrollmentCode: number) => {
    if (!profileData) {
      throw new Error('Dados do perfil não encontrados.')
    }

    const itens = [
      ...(enrollmentStatus === 'closed' && foraPrazo ? [createServiceItem(foraPrazo)] : []),
      createServiceItem(taxaMatricula!),
      ...selectedSubjects.map((subject) =>
        createDisciplineItem(subject, currentAcademicYear?.codigo!),
      ),
    ]

    const invoice: CreateInvoiceBody = {
      polo_id: profileData.poloid,
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
      Descricao: truncate('Matrícula + Inscrição em Disciplinas', 44),
      tipo_documento_factura_id: 1,
      canal: 3,
      DataFactura: new Date().toISOString(),
      codigo_anoLectivo: currentAcademicYear?.codigo!,
      itens,
    }

    return createInvoiceAsync(invoice)
  }

  const confirmStudentEnrollment = async () => {
    if (grades.length !== selectedSubjects.length) {
      toast.warning('Selecione todas as disciplinas obrigatórias.')
      return
    }

    if (!profileData?.codigo_preinscricao) {
      toast.error('Código de pré-inscrição não encontrado.')
      return
    }

    if (!currentAcademicYear?.codigo) {
      toast.error('Ano lectivo não encontrado.')
      return
    }

    try {
      const response = await confirmNewStudentEnrollmentAsync({
        selectedSubjects,
        codPreInscricao: profileData.codigo_preinscricao.toString(),
        anoLectivo: Number(currentAcademicYear.codigo),
      })

      const enrollmentCode = response.data.codMatricula
      await wait(INVOICE_PROCESSING_DELAY_MS)
      await createInvoiceWithPayload(enrollmentCode)
    } catch (error) {
      toast.error('Não foi possível concluir a matrícula. Tente novamente.')
      console.error('Erro ao confirmar matrícula:', error)
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

   prazoValido, foraDoPrazo, aindaNaoComecou ,
        isErrorStudentCurriculumPlan: isErrorCurriculumPlan,
        isLoadingProfileData,
        isLoadingStudentCurriculumPlan: isLoadingCurriculumPlan,
        isExpanded,
        subject: grades ?? [],
        totalValue,
        toggleSubject,
        isSelected,
        toggleSection,
        selectAll,
        isAllSelected,
        confirmStudentEnrollment,
        confirmStudentEnrollmentState: confirmNewStudentEnrollmentPending,
        removeScheduleForSubject,
        selectScheduleForSubject,
        selectedSchedules,
        enrollmentStatus,
        isLoadingAcademmicYear: isLoadingAcademicYear,
        isErrorAcademicYear,
        isLoadingStudenttatistics: isLoadingStudentStatistics,
        studentStatistics,
        profileData,
        maxCourseGrade,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  )
}

// ----- Helpers -----

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength - 3)}...`
}

function createDisciplineItem(grade: Grade, academicYearCode: number) {
  const nomeCompleto = grade.disciplina || grade.codigoDisciplina || 'Disciplina'
  const obs = truncate(`Insc. ${nomeCompleto}`, MAX_OBS_LENGTH)

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
    mesTempId: 3,
    estado: 0,
    valorPago: 0,
    valorATransportar: 0,
    codigo_anoLectivo: academicYearCode,
  }
}

function createServiceItem(serviceType: TypeServiceResponse) {
  return {
    CodigoProduto: serviceType.codigo,
    Quantidade: 1,
    preco: serviceType.preco,
    Total: serviceType.preco,
    valor_pago: 0,
    obs: truncate(serviceType?.descricao ?? '', MAX_OBS_LENGTH),
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
