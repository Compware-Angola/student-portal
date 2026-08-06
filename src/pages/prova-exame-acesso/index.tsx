import { useState, useEffect, useMemo, useRef } from 'react'
import { toast } from 'sonner'
import AcessoBloqueado from './components/block-info'
import WaitingTest from './components/waiting-test'
import Questions from './components/questions'
import type { QuestionsHandle } from './components/questions'
import { useQueryInfoGeraisCandidatura } from '@/hooks/pre-registation/use-query-info-gerais-candidatura'
import { AdmissionStatus } from '@/enums/admission.status.enum'
import { FinanceInfo } from './components/finance-info'
import { ExamLoader } from './components/exam-loader'
import { useQueryApiStatus } from '@/hooks/pre-registation/use-query-api-status'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useQueryCandidateExam } from '@/hooks/exame/use-query-exame'
import type { Question } from '@/services/exame-acesso/exame.service'
import { CheckCircle2 } from 'lucide-react'
import { ExamPendingInfo } from './components/aguardar-atribuicao-prova'

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
    options: q.respostas.map((r) => ({
      id: r.id,
      label: r.resposta,
    })),
  }
}

// Monta a data/hora real do INÍCIO da prova a partir de data_prova (UTC) + hora_inicio ("HH:mm")
function getExamDateTime(dataProva?: string | null, horaStr?: string | null): Date | null {
  if (!dataProva) return null

  const base = new Date(dataProva)
  if (isNaN(base.getTime())) return null

  // Extrai o dia real da prova a partir dos componentes UTC
  // (evita o deslocamento causado pelo timezone do browser)
  const year = base.getUTCFullYear()
  const month = base.getUTCMonth()
  const day = base.getUTCDate()

  let hours = 0
  let minutes = 0
  if (horaStr) {
    const [h, m] = horaStr.split(':').map(Number)
    hours = isNaN(h) ? 0 : h
    minutes = isNaN(m) ? 0 : m
  }

  // Monta no timezone LOCAL do browser — correto aqui porque hora_inicio/hora_fim
  // já são "hora local de Angola" e o candidato acessa de Angola/WAT
  return new Date(year, month, day, hours, minutes, 0, 0)
}

function getSecondsRemaining(end: Date | null): number {
  if (!end) return 0
  return Math.max(0, Math.floor((end.getTime() - Date.now()) / 1000))
}

// Contador regressivo até uma data-alvo (usado para "aguardando início da prova")
function useCountdown(target: Date | null) {
  const [now, setNow] = useState(() => new Date())

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

  const { isLoading: isLoadingApiStatus, isError: isErrorApiStatus } =
    useQueryApiStatus({ enabled: isDiaProva })

  const { isLoading: isLoadingExam, data: candidateExam } = useQueryCandidateExam(
    profileData?.codigo_preinscricao!,
    isDiaProva,
  )

  // Memoizado: só recria a referência de Date quando os dados da API realmente mudam.
  // Sem isso, o useEffect do useCountdown reinicia o setInterval a cada render e o
  // contador trava (nunca completa um ciclo de 1000ms).
  const examStart = useMemo(
    () => getExamDateTime(info?.data_prova, info?.hora_inicio),
    [info?.data_prova, info?.hora_inicio],
  )
  const examEnd = useMemo(
    () => getExamDateTime(info?.data_prova, info?.hora_fim),
    [info?.data_prova, info?.hora_fim],
  )

  const { diff, days, hours, minutes, seconds } = useCountdown(examStart)
  const examOpen = FORCE_EXAM_OPEN || diff === 0

  // Ref para o componente Questions, usado para forçar a submissão real
  // quando o tempo esgota (em vez de só simular localmente).
  const questionsRef = useRef<QuestionsHandle>(null)

  // Trava para garantir que a submissão automática (por tempo esgotado)
  // só é disparada UMA vez, mesmo que o intervalo continue a correr
  // enquanto a chamada assíncrona de submitFinal ainda não terminou.
  const autoSubmitTriggered = useRef(false)

  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)

  // Contador regressivo DURANTE a prova, baseado no horário real de término
  // (examEnd fixo) — não em "tempo desde que abriu a página". Quem entra
  // atrasado tem menos tempo, mas todos terminam à mesma hora.
  const [remaining, setRemaining] = useState(() => getSecondsRemaining(examEnd))

  useEffect(() => {
    if (!examOpen || submitted || !examEnd) return

    const tick = () => {
      const secs = getSecondsRemaining(examEnd)
      setRemaining(secs)
      if (secs === 0 && !autoSubmitTriggered.current) {
        autoSubmitTriggered.current = true
        // Não marcamos "submitted" aqui diretamente — isso só acontece
        // depois de submitFinal() ter sucesso de verdade na API,
        // via onExamFinished (chamado dentro de handleFinalSubmit).
        toast.info('Tempo esgotado!')
        questionsRef.current?.submitExam()
      }
    }

    tick() // calcula e verifica imediatamente ao abrir, sem esperar o primeiro tick de 1s
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [examOpen, submitted, examEnd])

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

  if (AdmissionStatus.SEM_ADMISSAO === info?.estado_aluno && !info?.payments?.is_payed) {
    return <FinanceInfo />
  }

  if (AdmissionStatus.SEM_ADMISSAO === info?.estado_aluno && info?.payments?.is_payed) {
    return <ExamPendingInfo />
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
    if (isErrorApiStatus) {
      return (
        <AcessoBloqueado
          INSTITUTION_WIFI={INSTITUTION_WIFI}
          INSTITUTION_NAME={INSTITUTION_NAME}
        />
      )
    }

    // Prova já foi submetida (manual ou por tempo esgotado) — mostra o
    // ecrã de conclusão em vez de continuar a exibir as perguntas.
    if (submitted) {
      return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
          <div className="w-18 h-18 rounded-full bg-green-50 flex items-center justify-center mb-8">
            <CheckCircle2 className="w-9 h-9 text-green-600" />
          </div>

          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
            Estado da prova
          </p>
          <h2 className="text-2xl font-semibold text-foreground mb-4 text-center">
            Prova submetida com sucesso
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-10 max-w-md text-center">
            As suas respostas foram registadas. Os resultados serão
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

    return (
      <Questions
        ref={questionsRef}
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