import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

type ProgressStepProps = {
  step: string
}

const steps = [
  { key: 'search', label: 'Buscar Dívidas' },
  { key: 'simulate', label: 'Simular' },
  { key: 'confirm', label: 'Confirmar' },
  { key: 'complete', label: 'Concluído' },
]

export function ProgressStep({ step }: ProgressStepProps) {
  return (
    <Card>
      <CardContent className="pt-2">
        <Separator className="my-1" />
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-4
            gap-4
          "
        >
          {steps.map((item, index) => (
            <div
              key={item.key}
              className={`
                flex items-center gap-2
                ${step === item.key ? 'text-primary' : 'text-muted-foreground'}
              `}
            >
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${
                    step === item.key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }
                `}
              >
                {index + 1}
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>

        <Separator className="my-1" />
      </CardContent>
    </Card>
  )
}
