import { CalendarX, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

type View =
  | "login"
  | "forgot"
  | "update-request"
  | "validate-doc"
  | "register"

interface RegistrationClosedProps {
  setView: (view: View) => void
}

export function RegistrationClosed({
  setView,
}: RegistrationClosedProps) {
  return (
    <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <CalendarX className="h-8 w-8 text-destructive" />
      </div>

      <h2 className="mt-6 text-2xl font-semibold">
        Período de inscrições encerrado
      </h2>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Neste momento não existe nenhum período de inscrição disponível.
        Aguarde a abertura de uma nova fase ou contacte os serviços académicos
        para mais informações.
      </p>

      <Button
        className="mt-8 w-full"
        variant="outline"
        onClick={() => setView("login")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para o início
      </Button>
    </div>
  )
}