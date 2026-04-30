import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  FormPreSubscriptionProvider,
  useFormPreSubscriptionForm,
} from './components/form-provider'
import { ProgressBar } from './components/progress-bar'
import { Form } from '@/components/ui/form'

import { SpepNavigation } from './components/spep-navigation'

export function PreSubscription() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Formulário de Candidaturas</h1>
        <p className="text-muted-foreground mt-2">
          Preencha o formulário para realizar a pré-inscrição ao exame de acesso
        </p>
      </div>
      <FormPreSubscriptionProvider>
        <Temp />
      </FormPreSubscriptionProvider>
    </div>
  )
}

function Temp() {
  const { steps, currentStep, form, onSubmit } = useFormPreSubscriptionForm()
  return (
    <>
      <ProgressBar />
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {steps[currentStep].component}
              <SpepNavigation />
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}
