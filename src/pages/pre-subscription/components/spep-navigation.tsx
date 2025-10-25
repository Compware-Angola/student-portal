import { Button } from '@/components/ui/button'
import { useFormPreSubscriptionForm } from './form-provider'
import { ArrowRight, LoaderCircle, Send } from 'lucide-react'

export function SpepNavigation() {
  const { currentStep, steps, handleBack, handleNextOrSubmit } =
    useFormPreSubscriptionForm()
  const isLoading = false // Replace with actual loading state

  return (
    <div className="flex justify-between gap-4">
      {currentStep > 0 && (
        <Button
          className=" cursor-pointer"
          type="button"
          variant="outline"
          onClick={handleBack}
        >
          Voltar
        </Button>
      )}

      <Button
        className="cursor-pointer"
        disabled={isLoading}
        type="button"
        onClick={handleNextOrSubmit}
      >
        {isLoading ? (
          <>
            <LoaderCircle className="w-5 h-5 animate-spin mr-2" />
            Enviando...
          </>
        ) : currentStep < steps.length - 1 ? (
          <>
            Próximo <ArrowRight className="ml-2 h-4 w-4" />
          </>
        ) : (
          <>
            Enviar
            <Send className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  )
}
