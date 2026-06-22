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
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useQueryCandidateExam } from '@/hooks/exame/use-query-exame'
import type { Question } from '@/services/exame-acesso/exame.service'
import { CheckCircle2 } from 'lucide-react'



const FORCE_EXAM_OPEN = false
const INSTITUTION_NAME = 'Universidade Metodista de Angola'
const INSTITUTION_WIFI = 'UMA-CAMPUS'

const examInfo = {
  room: 'Auditório A — Bloco 2',
  time: '08:00 — 10:00',
}

// Mapeia a pergunta da API para o formato usado pelo componente Questions
function mapQuestion(q: Question) {
  return {
    id: q.id,
    subject: q.disciplina,
    statement: q.pergunta,
    // cada opção carrega o id da resposta para podermos submeter depois
    options: q.respostas.map((r) => ({
      id: r.id,
      label: r.resposta,
    })),
  }
}

function useCountdown(target: Date | null) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    if (!target) return
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [target])

  if (!target) {
    return { diff: null, days: 0, hours: 0, minutes: 0, seconds: 0, hasDate: false }
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
  const { profileData } = useQueryProfile()
  const isDiaProva = info?.estado_aluno === AdmissionStatus.DIA_DA_PROVA
  // CALCULAR A DURACAO
  const horaInicio = info?.hora_inicio
  const horaFim = info?.hora_fim
  // converter string para date
  const dateInicio = horaInicio ? new Date(horaInicio) : null
  const dateFim = horaFim ? new Date(horaFim) : null
  const EXAM_DURATION_MIN = dateFim && dateInicio ? Math.floor((dateFim.getTime() - dateInicio.getTime()) / 60000) : 120

  const { isLoading: isLoadingApiStatus, isError: isErrorApiStatus } =
    useQueryApiStatus({ enabled: isDiaProva })

  // Busca a prova do candidato via API
  const { isLoading: isLoadingExam, data: candidateExam } = useQueryCandidateExam(
    profileData?.codigo_preinscricao!,
    isDiaProva, // só habilita quando for dia da prova
  )

  const date = !info?.data_prova ? null : new Date(info.data_prova)
  const { diff, days, hours, minutes, seconds } = useCountdown(date)
  const examOpen = FORCE_EXAM_OPEN || diff === 0

  const [current, setCurrent] = useState(0)
  // answers: { [perguntaId]: respostaId }
  const [answers, setAnswers] = useState<Record<number, number>>({})
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
      toast.success('Tempo esgotado! A sua prova foi submetida automaticamente.')
    }
  }, [remaining, examOpen, submitted])

  // Mapeia perguntas da API para o formato do componente
  const questions = useMemo(
    () => (candidateExam?.perguntas ?? []).map(mapQuestion),
    [candidateExam],
  )

  const answeredCount = Object.keys(answers).length
  const progress = useMemo(
    () => (questions.length > 0 ? (answeredCount / questions.length) * 100 : 0),
    [answeredCount, questions.length],
  )

  const formatClock = (s: number) => {
    const h = String(Math.floor(s / 3600)).padStart(2, '0')
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
    const sec = String(s % 60).padStart(2, '0')
    return `${h}:${m}:${sec}`
  }

  if (isLoading || isLoadingApiStatus || (isDiaProva && isLoadingExam)) {
    return <ExamLoader />
  }

  if (AdmissionStatus.SEM_ADMISSAO === info?.estado_aluno) {
    return <FinanceInfo />
  }

  if (AdmissionStatus.AGUARDANDO_DIA_DA_PROVA === info?.estado_aluno) {
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

  if (info?.estado_aluno === AdmissionStatus.DIA_DA_PROVA) {
    return isErrorApiStatus ? (
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
        examInfo={{
          ...examInfo,
          candidate: profileData?.nome_completo ?? '',
          course: profileData?.curso_candidatura_designacao ?? '',
        }}
        provaId={candidateExam?.provaId!}
        candidateId={profileData?.codigo_preinscricao!}
        onExamFinished={() => setSubmitted(true)}
      />
    )
  }

  if (
    info?.estado_aluno === AdmissionStatus.ADMITIDO_SEM_MATRICULA ||
    info?.estado_aluno === AdmissionStatus.NAO_ADMITIDO
  ) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 text-sm flex items-center gap-2">
        <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
        Resultados Disponibilizados no dashboard ✔
      </div>
    )
  }

  if (info?.estado_aluno === AdmissionStatus.AGUARDANDO_RESULTADO) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">

        <div className="w-18 h-18 rounded-full bg-green-50 flex items-center justify-center mb-8">
          <CheckCircle2 className="w-9 h-9 text-green-600" />
        </div>

        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
          Estado da candidatura
        </p>
        <h2 className="text-2xl font-semibold text-foreground mb-4 text-center">
          Prova concluída com sucesso
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-10 max-w-md text-center">
          A sua prova foi realizada com sucesso. Os resultados serão
          disponibilizados em breve. Fique atento ao seu painel.
        </p>

        <div className="flex items-center gap-2 bg-muted border rounded-md px-4 py-3">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
          <span className="text-sm text-muted-foreground">
            A aguardar a publicação dos resultados
          </span>
        </div>

      </div>
    )
  }
}

export default ProvaExameAcesso