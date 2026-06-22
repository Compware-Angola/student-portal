import { Card, CardContent } from '@/components/ui/card'
import { useFormPreSubscriptionForm } from './form-provider'
import { cn } from '@/lib/utils'
import { CheckCircle2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export function ProgressBar() {
  const { progress, steps, currentStep } = useFormPreSubscriptionForm()
  return (
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
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors',
                      isCompleted
                        ? 'bg-primary border-primary text-primary-foreground'
                        : isActive
                          ? 'border-primary text-primary'
                          : 'border-muted text-muted-foreground',
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-xs text-truncate font-medium text-center',
                      isActive ? 'text-primary' : 'text-muted-foreground',
                    )}
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
  )
}
