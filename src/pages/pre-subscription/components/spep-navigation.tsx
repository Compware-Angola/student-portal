import { Button } from '@/components/ui/button'
import { useFormPreSubscriptionForm } from './form-provider'
import { ArrowRight, LoaderCircle, Send } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

export function SpepNavigation() {
  const {
    currentStep,
    steps,
    handleBack,
    handleNextOrSubmit,
    isLoadingPreInscription,
  } = useFormPreSubscriptionForm()

  const currentStepConfig = steps[currentStep]

  const isSummary = currentStepConfig.isSummary
  const isSubmitStep = currentStepConfig.submitOnStep

  if (isSummary) return null

  return (
    <div className="flex justify-between gap-4">
      {/* Voltar */}
      {currentStep > 0 && (
        <Button
          className="cursor-pointer"
          type="button"
          variant="outline"
          onClick={handleBack}
        >
          Voltar
        </Button>
      )}

      {/* Próximo ou Enviar */}
      <Button
        className="cursor-pointer"
        type="button"
        disabled={isLoadingPreInscription}
        onClick={handleNextOrSubmit}
      >
        {isLoadingPreInscription ? (
          <>
            <LoaderCircle className="w-5 h-5 animate-spin mr-2" />
            Enviando...
          </>
        ) : isSubmitStep ? (
          <>
            {isLoadingPreInscription && <Spinner />}
            Enviar
            {!isLoadingPreInscription && <Send className="ml-2 h-4 w-4" />}
          </>
        ) : (
          <>
            Próximo <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  )
}
