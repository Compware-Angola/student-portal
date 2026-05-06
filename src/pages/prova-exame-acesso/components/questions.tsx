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
import { useState } from 'react'
import { toast } from 'sonner'
import { PasswordDialog } from './password-dialog'
import { StartExam } from './start-exam'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { fmt } from '@/utils/fmt'
import { useMutationUnlockTest } from '@/hooks/pre-registation/use-mutation-validate-password'
import { useQueryInfoGeraisCandidatura } from '@/hooks/pre-registation/use-query-info-gerais-candidatura'
const MAX_PASSWORD_ATTEMPTS = 10
const EXAM_PASSWORD = '1234'
interface WaitingTestProps {
  current: number
  setCurrent: (current: number) => void
  questions: any[]
  answers: any
  setAnswers: (answers: any) => void
  answeredCount: number
  progress: number
  remaining: number
  formatClock: (remaining: number) => string
  handleSubmit: () => void
  examInfo: any
}
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
  handleSubmit,
  examInfo,
}: WaitingTestProps) {
  const q = questions[current]
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [shake, setShake] = useState(false)
  const [startExam, setStartExam] = useState<boolean>(true)
  const showPasswordModal = () => setPasswordOpen(true)
  const closePasswordModal = () => setPasswordOpen(false)
  const { profileData } = useQueryProfile()
  const { data: info } = useQueryInfoGeraisCandidatura()
  const blocked = attempts >= MAX_PASSWORD_ATTEMPTS
  const mutateUnlockPassword = useMutationUnlockTest()

  const saveUnlockAcces = () => {
    const codigoPreInscricao = profileData?.codigo_preinscricao
    const key = `@${codigoPreInscricao}`
    localStorage.setItem(key, 'unlocked')
  }

  const handleValidatePassword = async () => {
    const prova_id = info?.prova_id
    if (!prova_id) {
      toast.error('Erro ao tentar desbloquear a prova')
      return
    }
    await mutateUnlockPassword.unlockTestAsync({
      password: passwordInput,
      testId: prova_id,
    })
    if (mutateUnlockPassword.unlockTestSuccess) {
      saveUnlockAcces();
    }
  }
  if (startExam) {
    return (
      <>
        <StartExam onStart={showPasswordModal} />
        <PasswordDialog
          open={passwordOpen}
          onOpenChange={closePasswordModal}
          value={passwordInput}
          onChange={setPasswordInput}
          onSubmit={handleValidatePassword}
          show={showPassword}
          onToggleShow={() => setShowPassword((s) => !s)}
          error={passwordError}
          blocked={blocked}
          attempts={attempts}
          maxAttempts={MAX_PASSWORD_ATTEMPTS}
          shake={shake}
          candidate={fmt(profileData?.nome_completo)}
          course={fmt(profileData?.curso_candidatura_designacao)}
        />
      </>
    )
  }
  return (
    <>
      <div className="space-y-4 animate-fade-in">
        {/* Cabeçalho fixo da prova */}
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
                value={answers[q.id] ?? ''}
                onValueChange={(v: string) =>
                  setAnswers((a: any) => ({ ...a, [q.id]: v }))
                }
                className="space-y-3"
              >
                {q.options.map((opt: any, idx: any) => {
                  const id = `q${q.id}-opt${idx}`
                  const selected = answers[q.id] === opt
                  return (
                    <Label
                      key={id}
                      htmlFor={id}
                      className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors hover:bg-accent ${
                        selected ? 'border-primary bg-primary/5' : ''
                      }`}
                    >
                      <RadioGroupItem value={opt} id={id} />
                      <span className="text-base font-normal">
                        <span className="font-semibold mr-2">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        {opt}
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
                  <Button onClick={handleSubmit}>
                    <Send className="h-4 w-4" /> Submeter Prova
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      setCurrent(Math.min(questions.length - 1, current + 1))
                    }
                  >
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
              <CardDescription>
                Clique numa pergunta para ir até ela.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((qq, idx) => {
                  const isAnswered = !!answers[qq.id]
                  const isCurrent = idx === current
                  return (
                    <button
                      key={qq.id}
                      onClick={() => setCurrent(idx)}
                      className={`h-10 w-10 rounded-md border text-sm font-semibold transition-all ${
                        isCurrent
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
              <Button className="w-full" onClick={handleSubmit}>
                <Send className="h-4 w-4" /> Submeter Prova
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Questions
