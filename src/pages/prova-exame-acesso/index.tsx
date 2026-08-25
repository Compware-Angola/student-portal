import { useState, useEffect, useMemo, useRef } from 'react'
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
import { CheckCircle2, CheckIcon } from 'lucide-react'
import { ExamPendingInfo } from './components/aguardar-atribuicao-prova'
import { useSubmitCandidateExamFinal } from '@/hooks/exame/subamte-exame-mutation'

const FORCE_EXAM_OPEN = false
const INSTITUTION_NAME = 'Universidade Metodista de Angola'
const INSTITUTION_WIFI = 'UMA-CAMPUS'

// Chave de cache no localStorage para as respostas da prova. É construída por
// candidato + prova para garantir que respostas de provas/candidatos diferentes
// nunca se misturam no mesmo dispositivo.
const ANSWERS_CACHE_PREFIX = '@prova-exame-acesso:respostas:'

// Limite de tentativas e intervalo para a submissão automática (tempo esgotado)
// quando a primeira chamada falha (ex.: falha de rede momentânea).
const MAX_AUTO_SUBMIT_ATTEMPTS = 5
const AUTO_SUBMIT_RETRY_DELAY_MS = 5000

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
    cotacao: q.cotacao,
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

  // Janela real da prova: só conta como "hora da prova" quando a data/hora
  // atuais estão dentro do intervalo [início, fim]. O ExamLoader (e a prova em
  // si) só devem aparecer quando esta condição for verdadeira.
  const examOver = examEnd ? Date.now() >= examEnd.getTime() : false
  const isExamTime = examOpen && !examOver

  // Trava para garantir que a submissão automática (por tempo esgotado)
  // só é disparada UMA vez, mesmo que o intervalo continue a correr
  // enquanto a chamada assíncrona de submitFinal ainda não terminou.
  const autoSubmitTriggered = useRef(false)

  // Controle da submissão final: o ref impede chamadas concorrentes e o
  // estado alimenta o "A submeter..." dos botões.
  const isSubmittingFinalRef = useRef(false)
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false)

  // Controle de retry da submissão automática (tempo esgotado + falha de rede)
  const autoSubmitAttempts = useRef(0)
  const autoSubmitRetryTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )

  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)

  // ─── Cache local das respostas (localStorage) ────────────────────────────────
  // Guarda as respostas e a pergunta atual para que uma falha de internet ou um
  // reload da página não resulte em perda de informação. O cache é limpo quando
  // a prova é submetida com sucesso.
  const cacheKey = useMemo(() => {
    const candidateId = profileData?.codigo_preinscricao
    const pId = candidateExam?.provaId
    if (!candidateId || !pId) return null
    return `${ANSWERS_CACHE_PREFIX}${candidateId}:${pId}`
  }, [profileData?.codigo_preinscricao, candidateExam?.provaId])

  const [restored, setRestored] = useState(false)

  // Restaura as respostas guardadas assim que a chave de cache fica disponível
  useEffect(() => {
    if (!cacheKey || restored) return
    try {
      const stored = localStorage.getItem(cacheKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && typeof parsed === 'object') {
          if (parsed.answers && typeof parsed.answers === 'object') {
            setAnswers(parsed.answers)
          }
          if (typeof parsed.current === 'number') {
            setCurrent(parsed.current)
          }
        }
      }
    } catch {
      localStorage.removeItem(cacheKey)
    }
    setRestored(true)
  }, [cacheKey, restored])

  // Persiste as respostas a cada alteração (só depois de restaurado, para não
  // sobrescrever o cache com o estado vazio inicial)
  useEffect(() => {
    if (!cacheKey || !restored || submitted) return
    try {
      localStorage.setItem(cacheKey, JSON.stringify({ answers, current }))
    } catch {
      // Storage indisponível/cheio — ignora silenciosamente
    }
  }, [cacheKey, restored, submitted, answers, current])

  const candidateId = profileData?.codigo_preinscricao
  const provaId = candidateExam?.provaId

  const { mutateAsync: submitFinal } = useSubmitCandidateExamFinal(candidateId!)

  const clearUnlockAccess = () => {
    const key = `@${candidateId}`
    try {
      localStorage.removeItem(key)
    } catch {
      // ignora
    }
  }

  const cancelAutoSubmitRetry = () => {
    if (autoSubmitRetryTimer.current) {
      clearTimeout(autoSubmitRetryTimer.current)
      autoSubmitRetryTimer.current = null
    }
  }

  // Ref que aponta sempre para a versão mais recente de handleFinalSubmit.
  // Evita que o efeito do temporizador capture um handler "preso" no tempo e
  // dispensa adicionar handleFinalSubmit ao array de dependências (o que
  // reiniciaria o setInterval a cada render).
  const handleFinalSubmitRef = useRef<(opts?: { auto?: boolean }) => Promise<void>>(
    async () => {},
  )

  const scheduleAutoSubmitRetry = () => {
    if (autoSubmitAttempts.current >= MAX_AUTO_SUBMIT_ATTEMPTS) {
      toast.error(
        'Não foi possível submeter a prova automaticamente. Submeta manualmente.',
      )
      return
    }
    autoSubmitAttempts.current += 1
    cancelAutoSubmitRetry()
    autoSubmitRetryTimer.current = setTimeout(() => {
      void handleFinalSubmitRef.current({ auto: true })
    }, AUTO_SUBMIT_RETRY_DELAY_MS)
  }

  const handleFinalSubmit = async (opts: { auto?: boolean } = {}) => {
    if (isSubmittingFinalRef.current) return
    if (!provaId) {
      if (opts.auto) {
        // A prova (provaId) ainda não carregou — tenta novamente em breve.
        scheduleAutoSubmitRetry()
      } else {
        toast.error('Prova ainda não disponível.')
      }
      return
    }

    isSubmittingFinalRef.current = true
    setIsSubmittingFinal(true)
    try {
      await submitFinal({ provaId })
      autoSubmitAttempts.current = 0
      cancelAutoSubmitRetry()
      clearUnlockAccess()
      if (cacheKey) {
        try {
          localStorage.removeItem(cacheKey)
        } catch {
          // ignora
        }
      }
      toast.success('Prova submetida com sucesso!')
      setSubmitted(true)
    } catch {
      if (opts.auto) {
        scheduleAutoSubmitRetry()
      } else {
        toast.error('Erro ao finalizar a prova. Tente novamente.')
      }
    } finally {
      isSubmittingFinalRef.current = false
      setIsSubmittingFinal(false)
    }
  }

  // Mantém a ref atualizada com o handler deste render
  useEffect(() => {
    handleFinalSubmitRef.current = handleFinalSubmit
  })

  // Limpa o timer de retry pendente se o componente for desmontado
  useEffect(() => {
    return () => {
      if (autoSubmitRetryTimer.current) {
        clearTimeout(autoSubmitRetryTimer.current)
        autoSubmitRetryTimer.current = null
      }
    }
  }, [])

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
        // depois de submitFinal() ter sucesso de verdade na API.
        toast.info('Tempo esgotado!')
        void handleFinalSubmitRef.current({ auto: true })
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

  if (isLoading || isLoadingApiStatus || (isDiaProva && isLoadingExam && isExamTime)) {
    return <ExamLoader />
  }

  if (AdmissionStatus.SEM_ADMISSAO === info?.estado_aluno && !info?.payments?.is_payed) {
    return <FinanceInfo />
  }

  if (AdmissionStatus.SEM_ADMISSAO === info?.estado_aluno && info?.payments?.is_payed) {
    return <ExamPendingInfo />
  }

  if (
    (AdmissionStatus.AGUARDANDO_DIA_DA_PROVA === info?.estado_aluno ||
      (isDiaProva && !isExamTime)) &&
    !submitted
  ) {
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
        isSubmittingFinal={isSubmittingFinal}
        onSubmitFinal={() => void handleFinalSubmit()}
      />
    )
  }

  if (
    info?.estado_aluno === AdmissionStatus.ADMITIDO_SEM_MATRICULA ||
    info?.estado_aluno === AdmissionStatus.NAO_ADMITIDO
  ) {
    return (
<div className="relative overflow-hidden rounded-xl border border-success/30 bg-success/10 p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
  {/* faixa lateral tipo marca-texto */}
  <div className="absolute inset-y-0 left-0 w-1.5 bg-success animate-in slide-in-from-left duration-500" />

  {/* brilho sutil que passa uma vez, tipo "selo aprovado" */}
  <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.2s_ease-out_0.4s]" />

  <div className="flex items-center gap-3 pl-2">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground shadow-sm animate-in zoom-in-50 spin-in-6 duration-500 delay-150 fill-mode-both">
      <CheckIcon className="h-4.5 w-4.5" strokeWidth={3} />
    </span>

    <div className="flex flex-col animate-in fade-in slide-in-from-left-1 duration-500 delay-300 fill-mode-both">
      <span className="text-sm font-semibold text-success">
        Resultados disponibilizados 🎉
      </span>
      <span className="text-xs text-muted-foreground">
        Já podes consultar no teu dashboard
      </span>
    </div>
  </div>
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