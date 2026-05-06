import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  KeyRound,
  EyeOff,
  Eye,
  AlertCircle,
  ShieldAlert,
  Unlock,
  Loader2,
} from 'lucide-react'

function PasswordDialog({
  open,
  onOpenChange,
  value,
  onChange,
  onSubmit,
  show,
  onToggleShow,
  error,
  shake,
  candidate,
  course,
  isLoading
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  show: boolean
  onToggleShow: () => void
  error: string | null
  shake: boolean
  candidate: string
  course: string
  isLoading: boolean
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="backdrop-blur-sm bg-black/10" />

      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <KeyRound className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">
            Senha de acesso à prova
          </DialogTitle>
          <DialogDescription className="text-center">
            Solicite a senha ao <strong>invigilador da sala</strong> e insira-a
            abaixo para iniciar a prova.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 p-3 text-sm space-y-1">
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Candidato:</span>
            <span className="font-medium truncate">{candidate}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Curso:</span>
            <span className="font-medium truncate">{course}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="exam-password">Senha</Label>
          <div
            className={`relative ${shake ? 'animate-[fade-in_0.1s_ease-out]' : ''}`}
            style={shake ? { animation: 'shake 0.4s' } : undefined}
          >
            <Input
              id="exam-password"
              type={show ? 'text' : 'password'}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Insira a senha fornecida"
              maxLength={32}
              autoFocus
              className="pr-10 tracking-widest"
            />
            <button
              type="button"
              onClick={onToggleShow}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
              aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {show ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" /> Acesso monitorado
            </span>
          </div>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button
            onClick={onSubmit}
            disabled={value.trim().length === 0 || isLoading}
            className="w-full"
          >
           {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Unlock className="h-4 w-4" />}  Iniciar Prova
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export { PasswordDialog }
