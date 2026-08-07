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
import type { SectionKey, SelectedSchedule } from '../types/enrollment'
import { useQueryMonthlyFeesValue } from '@/hooks/finance/use-query-monthly-fee'

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


type EnrollmentPostGraduationProviderProps = {
  children: ReactNode
}

export function EnrollmentPostGraduationProvider({ children }: EnrollmentPostGraduationProviderProps) {
  const [isExpanded, setIsExpanded] = useState<ToggleState>({
    new: true,
    pendents: true,
  })
  const [selectedSchedules, setSelectedSchedules] = useState<Record<string, SelectedSchedule>>({})
  const [selectedSubjects, setSelectedSubjects] = useState<Grade[]>([])

  const {
    profileData,
    isLoading: isLoadingProfileData,
    isError: isErrorProfileData,
  } = useQueryProfile()

  const {
    data: currentAcademicYear,
    isError: isErrorAcademicYear,
    isLoading: isLoadingAcademicYear,
  } = useQueryCurrentAcademicYear(profileData?.codigo_tipo_candidatura!)

  const { data: foraPrazo } = useTypeServiceSingle({
    currentYearCode: Number(currentAcademicYear?.codigo),
    ...SERVICE_TYPES.INSCRICAO_FORA_PRAZO,
  })

  const { isLoading: isLoadingStudentStatistics, data: studentStatistics } =
    useQueryStudentDashboardStatistics(profileData?.enrollmentCode)

  const { mapGrades } = useGradeMapper()


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
    semestre:1
  })

  const grades = mapGrades(curriculumPlan?.gradesAFazer ?? [])
  console.log({grades},'selectedSubjects')
  const { data: monthlyFeesValue } = useQueryMonthlyFeesValue({anoLetivo: parseFilter(currentAcademicYear?.codigo?.toString()),curso:parseFilter(profileData?.curso_candidatura.toString()),
    polo:1})
  const enrollmentStatus = useMemo(
    () => getEnrollmentStatus(enrollmentPeriod),
    [enrollmentPeriod],
  )
  console.log({enrollmentStatus})

  const { prazoValido, foraDoPrazo, aindaNaoComecou } = useMemo(
    () => getStatusPrazo(enrollmentPeriod?.calendario),
    [enrollmentPeriod],
  )

  const { confirmNewStudentEnrollmentPending, confirmNewStudentEnrollmentAsync } =
    useMutationConfirmNewStudentEnrollment()

  const { createInvoiceAsync } = useMutationCreateInvoice()

  const maxCourseGrade = Number(profileData?.max_cadeiras_curso)

  
  useEffect(() => {
    if (grades.length > 0 && selectedSubjects.length === 0) {
     
      setSelectedSubjects([...grades])
     
    }
  }, [grades, selectedSubjects.length])

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
    setSelectedSchedules((prev) => ({ ...prev, [codigoGrade]: horario }))
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

  
  const firstMonthlyFee = Number(monthlyFeesValue[0]?.preco)
  const foraPrazoValue = enrollmentStatus === 'closed' ? (foraPrazo?.preco ?? 0) : 0
  const totalPagar = firstMonthlyFee + foraPrazoValue

  // ----- Fatura -----

  const createInvoiceWithPayload = async (enrollmentCode: number) => {
    if (!profileData) {
      throw new Error('Dados do perfil não encontrados.')
    }

    const itens = [
      ...(enrollmentStatus === 'closed' && foraPrazo ? [createServiceItem(foraPrazo)] : []),
      createServiceItem(monthlyFeesValue[0]!),
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
      Descricao: truncate('Mestrado', 44),
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
        firstMonthlyFee,
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



interface ServiceItemData {
  codigo: number | string
  descricao?: string
  preco: number | string
}

function createServiceItem<T extends ServiceItemData>(service: T) {
  const price = Number(service.preco)

  return {
    CodigoProduto: Number(service.codigo),
    Quantidade: 1,
    preco: price,
    Total: price,
    valor_pago: 0,
    obs: truncate(service.descricao ?? '', MAX_OBS_LENGTH),
    taxaIva: 1,
    valorIva: 0,
    retencao: 0,
    incidencia: 0,
    valorDesconto: 0,
    descontoProduto: 0,
    mes: '',
    multa: 0,
    mesTempId: 1,
    estado: 0,
    valorPago: 0,
    valorATransportar: 0,
  }
}