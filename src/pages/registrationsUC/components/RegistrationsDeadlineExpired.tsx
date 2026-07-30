import { CalendarClock, GraduationCap, Mail, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface RegistrationsDeadlineExpiredProps {
  dataLimite?: string
  proximoPeriodo?: string
}

export function RegistrationsDeadlineExpired({
  dataLimite,
  proximoPeriodo,
}: RegistrationsDeadlineExpiredProps) {
  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-primary/[0.03] to-transparent">
      <CardContent className="flex flex-col items-center px-6 py-12 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
          <div className="relative rounded-full bg-primary/10 p-5">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>
        </div>

        <h3 className="mb-2 text-xl font-bold">
          Período de Confirmação Encerrado
        </h3>

        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          {dataLimite
            ? `A janela para confirmar disciplinas fechou em ${dataLimite}. A tua vida académica continua — trata a regularização junto da secretaria.`
            : 'A janela para confirmar disciplinas já fechou. A tua vida académica continua — trata a regularização junto da secretaria.'}
        </p>

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
        </a>
      </CardContent>
    </Card>
  )
}