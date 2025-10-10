import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, Clock, Info, Percent } from 'lucide-react'

export function BenefitsCard() {
  return (
    <Alert className="border-border  mb-6">
      <Info className="h-5 w-5" />
      <AlertDescription className="ml-2">
        <h3 className="mb-3 text-lg">Benefícios do Pagamento Antecipado</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <Percent className="w-4 h-4 " />
            Desconto de até 20% no valor total
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 " />
            Garantia de vaga para o próximo semestre
          </li>
          <li className="flex items-center gap-2">
            <Clock className="w-4 h-4 " />
            Prioridade na escolha de horários
          </li>
        </ul>
      </AlertDescription>
    </Alert>
  )
}
