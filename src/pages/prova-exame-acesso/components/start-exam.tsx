import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Clock, Play } from 'lucide-react'
import ExameTimeLoader from '@/assets/TimeLoader.json'
import Lottie from 'lottie-react'
type StartExamProps = {
  examDate: string
  examTime: string
  onStart: () => void
}
export const StartExam = ({ examDate, examTime, onStart }: StartExamProps) => {

  return (
    <>
      <div className="w-full mx-auto animate-fade-in">
        <Card>
          <CardContent className="p-10 text-center space-y-4">
            <div className="mx-auto w-80 h-80 rounded-full bg-primary/10 flex items-center justify-center">
              <Lottie
                animationData={ExameTimeLoader}
                loop={true}
                style={{ width: 400, height: 400 }}
              />
            </div>

            <h2 className="text-2xl font-bold">Pronto para iniciar a prova?</h2>

            <p className="text-muted-foreground">
              A sua inscrição foi confirmada com sucesso.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="rounded-lg border px-4 py-3 bg-muted/30">
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  <Calendar className="h-4 w-4 text-primary" /> Data da prova
                </div>
                <p className="text-base font-semibold">{examDate}</p>
              </div>
              <div className="rounded-lg border px-4 py-3 bg-muted/30">
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  <Clock className="h-4 w-4 text-primary" /> Horário da prova
                </div>
                <p className="text-base font-semibold">{examTime}</p>
              </div>
            </div>

            <p className="text-muted-foreground">
              Está prestes a iniciar a prova de admissão. Certifique-se de que
              está num ambiente tranquilo e com uma ligação estável à internet.
            </p>

            <p className="text-sm text-muted-foreground">
              Após clicar em <strong>Iniciar Prova</strong>, o tempo começará a
              contar automaticamente e não será possível pausar.
            </p>

            <p className="text-sm text-muted-foreground">
              Clique no botão abaixo apenas quando estiver totalmente preparado.
            </p>
            <div>
              <Button
                onClick={onStart}
                className="flex-1"

              >
                <Play />
                Iniciar Prova
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
