import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@radix-ui/react-separator'
import { ChevronLeft, ChevronRight, Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { PasswordDialog } from './password-dialog'
import { StartExam } from './start-exam'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { fmt } from '@/utils/fmt'
import { useMutationUnlockTest } from '@/hooks/pre-registation/use-mutation-validate-password'
import { useQueryInfoGeraisCandidatura } from '@/hooks/pre-registation/use-query-info-gerais-candidatura'
import { calculateDuration } from '@/utils/calcular-duracao'
import { useSubmitCandidateExam, useSubmitCandidateExamFinal } from '@/hooks/exame/subamte-exame-mutation'

// Formato mapeado pelo pai
export type MappedOption = {
  id: number      // respostaId
  label: string   // texto da resposta
}

export type MappedQuestion = {
  id: number
  subject: string
  statement: string
  options: MappedOption[]
}

interface QuestionsProps {
  current: number
  setCurrent: (current: number) => void
  questions: MappedQuestion[]
  // answers: { [perguntaId]: respostaId }
  answers: Record<number, number>
  setAnswers: (fn: (prev: Record<number, number>) => Record<number, number>) => void
  answeredCount: number
  progress: number
  remaining: number
  formatClock: (remaining: number) => string
  examInfo: {
    candidate: string
    course: string
    room?: string
    time?: string
  }
  provaId: number
  candidateId: number
  onExamFinished: () => void
}

const DEFAULT_DURATION = 1000 * 60 * 60 * 3 // 3h

function Questions({
  current,
  setCurrent,
  questions,
  answers,
  setAnswers,
  answeredCount,
  progress,
  remaining,
  formatClock,
  examInfo,
  provaId,
  candidateId,
  onExamFinished,
}: QuestionsProps) {
  const q = questions[current]

  const [passwordOpen, setPasswordOpen] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [shake, setShake] = useState(false)
  const [startExam, setStartExam] = useState(true)
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false)

  const { profileData } = useQueryProfile()
  const { data: info } = useQueryInfoGeraisCandidatura()
  const mutateUnlockPassword = useMutationUnlockTest()

  const { mutateAsync: submitAnswer } = useSubmitCandidateExam(candidateId)
  const { mutateAsync: submitFinal } = useSubmitCandidateExamFinal(candidateId)

  // ─── Unlock / Password ──────────────────────────────────────────────────────
  const saveUnlockAccess = () => {
    const key = `@${candidateId}`
    localStorage.setItem(key, JSON.stringify({ unlocked: true, timestamp: Date.now() }))
  }

  const loadUnlockAccess = () => {
    if (!candidateId) return
    const key = `@${candidateId}`
    const stored = localStorage.getItem(key)
    if (!stored) return
    let parsed: any
    try { parsed = JSON.parse(stored) } catch { localStorage.removeItem(key); return }
    if (!parsed?.unlocked || !parsed?.timestamp) { localStorage.removeItem(key); return }

    const durationMinutes = calculateDuration(info?.hora_inicio, info?.hora_fim)
    const durationMs = durationMinutes && durationMinutes > 0
      ? durationMinutes * 60 * 1000
      : DEFAULT_DURATION

    if (Date.now() - parsed.timestamp >= durationMs) {
      localStorage.removeItem(key)
      return
    }
    setStartExam(false)
  }

  useEffect(() => { loadUnlockAccess() }, [candidateId])

  const handleValidatePassword = async () => {
    try {
      const prova_id = info?.prova_id
      if (!prova_id) { toast.error('Erro ao tentar desbloquear a prova'); return }
      await mutateUnlockPassword.unlockTestAsync({ password: passwordInput, testId: prova_id })
      saveUnlockAccess()
      setStartExam(false)
    } catch {
      setPasswordError('Senha incorreta')
      setShake(true)
    }
  }

  // ─── Responder pergunta ──────────────────────────────────────────────────────
  // Chamado sempre que o candidato seleciona uma opção
  const handleSelectAnswer = async (perguntaId: number, respostaId: number) => {
    // Optimistic update: já marca a resposta na UI
    setAnswers((prev) => ({ ...prev, [perguntaId]: respostaId }))

    try {
      await submitAnswer({
        provaId,
        respostas: [{ perguntaId, respostaId }],
      })
    } catch {
      // Não bloqueia o candidato — a resposta fica salva localmente
      // e pode ser reenviada na submissão final
      toast.error('Erro ao guardar resposta. Verifique a ligação.')
    }
  }

  // ─── Submissão final ─────────────────────────────────────────────────────────
  const handleFinalSubmit = async () => {
    if (isSubmittingFinal) return
    setIsSubmittingFinal(true)
    try {
      await submitFinal({ provaId })
      toast.success('Prova submetida com sucesso!')
      onExamFinished()
    } catch {
      toast.error('Erro ao finalizar a prova. Tente novamente.')
    } finally {
      setIsSubmittingFinal(false)
    }
  }

  // ─── Guard: prova não carregada ainda ────────────────────────────────────────
  if (!q) return null

  // ─── Ecrã de início / senha ──────────────────────────────────────────────────
  if (startExam) {
    return (
      <>
        <StartExam onStart={() => setPasswordOpen(true)} />
        <PasswordDialog
          isLoading={mutateUnlockPassword.unlockTestPending}
          open={passwordOpen}
          onOpenChange={() => setPasswordOpen(false)}
          value={passwordInput}
          onChange={setPasswordInput}
          onSubmit={handleValidatePassword}
          show={showPassword}
          onToggleShow={() => setShowPassword((s) => !s)}
          error={passwordError}
          shake={shake}
          candidate={fmt(profileData?.nome_completo)}
          course={fmt(profileData?.curso_candidatura_designacao)}
        />
      </>
    )
  }

  // ─── Ecrã da prova ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Cabeçalho fixo */}
      <Card className="sticky top-16 z-10">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold">Prova de Admissão</h1>
            <p className="text-sm text-muted-foreground">
              {examInfo.candidate} — {examInfo.course}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Tempo restante</p>
              <p className="text-xl font-mono font-bold text-primary">
                {formatClock(remaining)}
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {answeredCount}/{questions.length} respondidas
            </Badge>
          </div>
        </CardContent>
        <Progress value={progress} className="h-1 rounded-none" />
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        {/* Pergunta atual */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline">{q.subject}</Badge>
              <span className="text-sm text-muted-foreground">
                Pergunta {current + 1} de {questions.length}
              </span>
            </div>
            <CardTitle className="text-xl pt-2">{q.statement}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              // valor é o respostaId convertido para string (RadioGroup trabalha com strings)
              value={answers[q.id] != null ? String(answers[q.id]) : ''}
              onValueChange={(v) => handleSelectAnswer(q.id, Number(v))}
              className="space-y-3"
            >
              {q.options.map((opt, idx) => {
                const inputId = `q${q.id}-opt${idx}`
                const selected = answers[q.id] === opt.id
                return (
                  <Label
                    key={opt.id}
                    htmlFor={inputId}
                    className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors hover:bg-accent ${selected ? 'border-primary bg-primary/5' : ''
                      }`}
                  >
                    {/* O value agora é o id da resposta */}
                    <RadioGroupItem value={String(opt.id)} id={inputId} />
                    <span className="text-base font-normal">
                      <span className="font-semibold mr-2">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      {opt.label}
                    </span>
                  </Label>
                )
              })}
            </RadioGroup>

            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrent(Math.max(0, current - 1))}
                disabled={current === 0}
              >
                <ChevronLeft className="h-4 w-4" /> Anterior
              </Button>

              {current === questions.length - 1 ? (
                <Button onClick={handleFinalSubmit} disabled={isSubmittingFinal}>
                  <Send className="h-4 w-4" />
                  {isSubmittingFinal ? 'A submeter...' : 'Submeter Prova'}
                </Button>
              ) : (
                <Button onClick={() => setCurrent(Math.min(questions.length - 1, current + 1))}>
                  Próxima <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Painel de navegação */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Navegação</CardTitle>
            <CardDescription>Clique numa pergunta para ir até ela.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((qq, idx) => {
                const isAnswered = answers[qq.id] != null
                const isCurrent = idx === current
                return (
                  <button
                    key={qq.id}
                    onClick={() => setCurrent(idx)}
                    className={`h-10 w-10 rounded-md border text-sm font-semibold transition-all ${isCurrent
                        ? 'border-primary bg-primary text-primary-foreground'
                        : isAnswered
                          ? 'border-primary/50 bg-primary/10 text-primary'
                          : 'border-input bg-background hover:bg-accent'
                      }`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>
            <Separator className="my-4" />
            <Button
              className="w-full"
              onClick={handleFinalSubmit}
              disabled={isSubmittingFinal}
            >
              <Send className="h-4 w-4" />
              {isSubmittingFinal ? 'A submeter...' : 'Submeter Prova'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Questions