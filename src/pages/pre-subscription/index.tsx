import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import {
  CheckCircle2,
  ArrowLeft,
  User,
  GraduationCap,
  FileText,
  CheckCheck,
} from 'lucide-react'
import { PersonalDetails } from './components/personal-details'
import { AcademicData } from './components/academic-data'
import { AcademicDocument } from './components/academic-document'

export function PreSubscription() {
  const [currentStep, setCurrentStep] = useState(3)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100
  const steps = [
    { number: 1, title: 'Dados Pessoais', icon: User },
    { number: 2, title: 'Dados Académicos', icon: GraduationCap },
    { number: 3, title: 'Dados da Candidatura', icon: FileText },
    { number: 4, title: 'Revisão', icon: CheckCheck },
  ]
  const onSubmitPersonal = () => {
    setCurrentStep(2)
  }
  const onSubmitAcademic = () => {
    setCurrentStep(3)
  }
  const onSubmitDocuments = () => {
    setCurrentStep(4)
  }
  const onFinalSubmit = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    toast.success('Pré-inscrição realizada com sucesso!', {
      description: 'Receberá um email com os próximos passos.',
    })
    setIsSubmitting(false)
  }
  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pré-Inscrição</h1>
        <p className="text-muted-foreground mt-2">
          Preencha o formulário para realizar a pré-inscrição ao exame de acesso
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              {steps.map((step) => {
                const Icon = step.icon
                const isActive = currentStep === step.number
                const isCompleted = currentStep > step.number
                return (
                  <div
                    key={step.number}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isCompleted
                          ? 'bg-primary border-primary text-primary-foreground'
                          : isActive
                            ? 'border-primary text-primary'
                            : 'border-muted text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium text-center ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                )
              })}
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Dados Pessoais */}
      {currentStep === 1 && (
        <PersonalDetails onClick={() => onSubmitPersonal()} />
      )}
      {/* Step 2: Dados Académicos */}
      {currentStep === 2 && (
        <AcademicData
          onHandleGoback={goBack}
          onHandleSubmitAcademic={onSubmitAcademic}
        />
      )}
      {/* Step 3: Documentos */}
      {currentStep === 3 && (
        <AcademicDocument onHandleGoback={goBack} onHandleDocumentsData={onSubmitDocuments}/>
      )}
      {/* Step 4: Revisão */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Revisão dos Dados</CardTitle>
            <CardDescription>
              Confirme todas as informações antes de submeter
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <h2>Revisão dos Dados</h2>
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={goBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button onClick={onFinalSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'A submeter...' : 'Submeter Pré-Inscrição'}
                {!isSubmitting && <CheckCheck className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
