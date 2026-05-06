import { useState, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import AcessoBloqueado from './components/block-info'
import WaitingTest from './components/waiting-test'
import Questions from './components/questions'
import { useQueryInfoGeraisCandidatura } from '@/hooks/pre-registation/use-query-info-gerais-candidatura'
import { AdmissionStatus } from '@/enums/admission.status.enum'
import { FinanceInfo } from './components/finance-info'
import { ExamLoader } from './components/exam-loader'
import { useQueryApiStatus } from '@/hooks/pre-registation/use-query-api-status'

const EXAM_DURATION_MIN = 120
const FORCE_EXAM_OPEN = false
const FORCE_OFF_CAMPUS = false
const INSTITUTION_NAME = 'Universidade Metodista de Angola'
const INSTITUTION_WIFI = 'UMA-CAMPUS'

const examInfo = {
  candidate: 'João Silva',
  course: 'Engenharia Informática',
  room: 'Auditório A — Bloco 2',
  time: '08:00 — 10:00',
  subjects: ['Matemática', 'Física', 'Língua Portuguesa'],
}

const questions = [
  {
    id: 1,
    subject: 'Matemática',
    statement: 'Qual é o valor de x na equação 2x + 6 = 18?',
    options: ['x = 4', 'x = 6', 'x = 8', 'x = 12'],
  },
  {
    id: 2,
    subject: 'Matemática',
    statement: 'O resultado de (3²) + (4²) é:',
    options: ['25', '49', '12', '7'],
  },
  {
    id: 3,
    subject: 'Física',
    statement: 'A unidade de medida da força no Sistema Internacional é:',
    options: ['Joule (J)', 'Watt (W)', 'Newton (N)', 'Pascal (Pa)'],
  },
  {
    id: 4,
    subject: 'Física',
    statement: 'Qual a velocidade da luz no vácuo (aproximadamente)?',
    options: ['3 × 10⁵ km/s', '3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10¹⁰ m/s'],
  },
  {
    id: 5,
    subject: 'Língua Portuguesa',
    statement: 'Qual das opções apresenta um substantivo coletivo?',
    options: ['Mesa', 'Cardume', 'Correr', 'Bonito'],
  },
  {
    id: 6,
    subject: 'Língua Portuguesa',
    statement: '“Os alunos estudaram muito.” — O sujeito da frase é:',
    options: ['estudaram', 'muito', 'Os alunos', 'alunos muito'],
  },
]

function useCountdown(target: Date | null) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    if (!target) return
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [target])

  if (!target) {
    return {
      diff: null,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      hasDate: false,
    }
  }

  const diff = Math.max(0, target.getTime() - now.getTime())

  return {
    diff,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    hasDate: true,
  }
}
const ProvaExameAcesso = () => {
  const { data: info, isLoading } = useQueryInfoGeraisCandidatura()
  const { isLoading: isLoadingApiStatus, isError: isErrorApiStatus } =
    useQueryApiStatus()
  const date = !info?.data_prova ? null : new Date(info?.data_prova)
  const { diff, days, hours, minutes, seconds } = useCountdown(date)
  const examOpen = FORCE_EXAM_OPEN || diff === 0
  const offCampus = FORCE_OFF_CAMPUS

  // Estado da prova
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [remaining, setRemaining] = useState(EXAM_DURATION_MIN * 60)

  useEffect(() => {
    if (!examOpen || submitted) return
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000)
    return () => clearInterval(t)
  }, [examOpen, submitted])

  useEffect(() => {
    if (examOpen && !submitted && remaining === 0) {
      setSubmitted(true)
      toast.success(
        'Tempo esgotado! A sua prova foi submetida automaticamente.',
      )
    }
  }, [remaining, examOpen, submitted])

  const answeredCount = Object.keys(answers).length
  const progress = useMemo(
    () => (answeredCount / questions.length) * 100,
    [answeredCount],
  )

  const formatClock = (s: number) => {
    const h = String(Math.floor(s / 3600)).padStart(2, '0')
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
    const sec = String(s % 60).padStart(2, '0')
    return `${h}:${m}:${sec}`
  }

  const handleSubmit = () => {
    setSubmitted(true)
    toast.success(
      `Prova submetida com sucesso! Você respondeu ${answeredCount} de ${questions.length} perguntas.`,
    )
  }
  if (isLoading || isLoadingApiStatus) {
    return <ExamLoader />
  }
  if (AdmissionStatus.SEM_ADMISSAO == info?.estado_aluno) {
    return <FinanceInfo />
  }
  if (AdmissionStatus.AGUARDANDO_DIA_DA_PROVA == info?.estado_aluno) {
    return (
      <WaitingTest
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        examInfo={examInfo}
      />
    )
  }

  if (offCampus) {
    return (
      <AcessoBloqueado
        INSTITUTION_WIFI={INSTITUTION_WIFI}
        INSTITUTION_NAME={INSTITUTION_NAME}
      />
    )
  }
  // ============ TELA: PROVA ATIVA ============
  if (info?.estado_aluno == AdmissionStatus.DIA_DA_PROVA) {
   return (
    <>
      {isErrorApiStatus ? (
        <AcessoBloqueado
          INSTITUTION_WIFI={INSTITUTION_WIFI}
          INSTITUTION_NAME={INSTITUTION_NAME}
        />
      ) : (
        <Questions
          current={current}
          setCurrent={setCurrent}
          questions={questions}
          answers={answers}
          setAnswers={setAnswers}
          answeredCount={answeredCount}
          progress={progress}
          remaining={remaining}
          formatClock={formatClock}
          handleSubmit={handleSubmit}
          examInfo={examInfo}
        />
      )}
    </>
  )
  }

  if (
    info?.estado_aluno == AdmissionStatus.ADMITIDO_SEM_MATRICULA ||
    info?.estado_aluno == AdmissionStatus.NAO_ADMITIDO
  )
    return (
      <>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 text-sm flex items-center gap-2">
          <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
          Resuldados Disponibilizados no dashboard ✔
        </div>
      </>
    )
  if (info?.estado_aluno == AdmissionStatus.AGUARDANDO_RESULTADO) {
    return (
      <>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 text-sm flex items-center gap-2">
          <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />A
          sua prova foi realizada com sucesso. Neste momento, deve aguardar a
          disponibilização dos resultados, ✔
        </div>
      </>
    )
  }
}

export default ProvaExameAcesso
