import { Loader2 } from "lucide-react"

export function PortalLoading() {
  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center rounded-xl border bg-card px-8 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>

      <h2 className="mt-6 text-xl font-semibold">
        A carregar...
      </h2>

      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Aguarde alguns instantes enquanto preparamos as informações do portal.
      </p>
    </div>
  )
}