import { ProgressBar } from './components/progress-bar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { SpepNavigation } from './components/spep-navigation'
import { FormPreSubscriptionPostGraduateProvider } from './components/postgraduate-form-provider'
import { useFormPreSubscriptionPostGraduateForm } from './components/hook'

export function PreSubscriptionPostgraduate() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Formulário de Candidaturas
        </h1>
        <p className="text-muted-foreground mt-2">Preencha o formulário</p>
      </div>
      <FormPreSubscriptionPostGraduateProvider>
        <Postgraduate />
      </FormPreSubscriptionPostGraduateProvider>
    </div>
  )
}

function Postgraduate() {
  const { steps, currentStep, form, onSubmit } =
    useFormPreSubscriptionPostGraduateForm()
  const StepComponent = steps[currentStep].component
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
              <StepComponent />
              <SpepNavigation />
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}
