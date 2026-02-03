import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  StudentSituationContext,
  type StudentSituationValue,
} from '@/context/student-situation'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'

type StudentSituationProviderProps = {
  children: React.ReactNode
}

export function StudentSituationProvider({
  children,
}: StudentSituationProviderProps) {
  const {
    profileData,
    isLoading: isLoading,
    isError: isError,
    error,
    refetch,
  } = useQueryProfile()

  const value: StudentSituationValue = {
    hasEnrolmentCode: Boolean(profileData?.enrollmentCode),
    isLoading: isLoading,
    hasError: isError,
    refetch,
  }

  return (
    <StudentSituationContext.Provider value={value}>
      <>
        {isLoading && <LoadingOverlay />}

        {isError && (
          <ErrorOverlay
            message="Erro ao consultar situação do estudante."
            details={error?.message}
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && children}
      </>
    </StudentSituationContext.Provider>
  )
}

function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-60 bg-background/95 flex flex-col items-center justify-center gap-6">
      <img
        src="/logo_uma.webp"
        alt="Universidade Metodista de Angola"
        className="h-24 w-auto animate-pulse"
      />

      <div className="flex items-center gap-3">
        <Spinner />
        <span className="text-sm text-muted-foreground">
          Processando, aguarde...
        </span>
      </div>
    </div>
  )
}
type ErrorOverlayProps = {
  message: string
  details?: string
  onRetry: () => void
}

function ErrorOverlay({ message, details, onRetry }: ErrorOverlayProps) {
  return (
    <div className="absolute inset-0 z-60 bg-background/95 flex flex-col items-center justify-center gap-4 text-center p-6">
      <p className="text-lg font-semibold text-destructive">{message}</p>

      {details && (
        <p className="text-xs text-muted-foreground max-w-md">{details}</p>
      )}

      <Button onClick={onRetry}>Tentar novamente</Button>
    </div>
  )
}
