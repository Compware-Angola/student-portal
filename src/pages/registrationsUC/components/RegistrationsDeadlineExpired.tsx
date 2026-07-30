import { CalendarClock, CheckCircle2, Circle, GraduationCap, Mail, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface RegistrationsDeadlineExpiredProps {
  dataLimite?: string
  proximoPeriodo?: string
}

const timelineSteps = [
  { label: 'Matrícula', status: 'done' as const },
  { label: 'Confirmação de disciplinas', status: 'done' as const },
  { label: 'Período atual', status: 'current' as const },
  { label: 'Próximo período', status: 'upcoming' as const },
]

export function RegistrationsDeadlineExpired({
  dataLimite,
  proximoPeriodo,
}: RegistrationsDeadlineExpiredProps) {
  return (
    <Card className="animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-primary/[0.03] to-transparent duration-500">
      <CardContent className="flex flex-col items-center px-6 py-12 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/10 blur-xl" />
          <div className="relative rounded-full bg-primary/10 p-5">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>
        </div>

        <h3 className="mb-2 text-xl font-bold">Acompanha o teu percurso</h3>

        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          {dataLimite
            ? `A janela para confirmar disciplinas fechou em ${dataLimite}. A tua vida académica continua — trata a regularização junto da secretaria.`
            : 'A janela para confirmar disciplinas já fechou. A tua vida académica continua — trata a regularização junto da secretaria.'}
        </p>

        {/* Timeline */}
        <div className="mt-8 w-full max-w-lg">
          <div className="relative flex items-center justify-between">
            {/* linha de fundo */}
            <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-border" />
            {/* linha animada até o passo atual */}
            <div
              className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-primary transition-all duration-1000 ease-out"
              style={{
                width: `${
                  (timelineSteps.findIndex(s => s.status === 'current') /
                    (timelineSteps.length - 1)) *
                  100
                }%`,
              }}
            />

            {timelineSteps.map((step, i) => (
              <div
                key={step.label}
                className="relative z-10 flex flex-col items-center gap-2"
              >
                <div className="relative flex h-6 w-6 items-center justify-center">
                  {step.status === 'current' && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50" />
                  )}
                  {step.status === 'done' && (
                    <CheckCircle2 className="relative h-6 w-6 rounded-full bg-background text-primary" />
                  )}
                  {step.status === 'current' && (
                    <span className="relative flex h-3.5 w-3.5 rounded-full bg-primary ring-4 ring-background" />
                  )}
                  {step.status === 'upcoming' && (
                    <Circle className="relative h-6 w-6 rounded-full bg-background text-muted-foreground/40" />
                  )}
                </div>
                <span
                  className={cn(
                    'max-w-[70px] text-[11px] leading-tight',
                    step.status === 'current'
                      ? 'font-medium text-primary'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid w-full max-w-md gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-lg border bg-background/60 p-4 text-left">
            <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">Próximo período</p>
              <p className="text-xs text-muted-foreground">
                {proximoPeriodo ?? 'A anunciar em breve'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border bg-background/60 p-4 text-left">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">Onde regularizar</p>
              <p className="text-xs text-muted-foreground">
                Secretaria académica do teu polo
              </p>
            </div>
          </div>
        </div>

        
         <a
          href="#"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <Mail className="h-4 w-4" />
          Contactar a secretaria
        </a>tactar a secretaria
       
      </CardContent>
    </Card>
  )
}