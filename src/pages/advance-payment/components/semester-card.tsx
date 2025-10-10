import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {
  semester: string
  period: string
  amount: number
  discount: number
  onPay: () => void
}

export function SemesterCard({
  semester,
  period,
  amount,
  discount,
  onPay,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{semester}</CardTitle>
        <p className="text-sm">{period}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Valor Original:</span>
            <span>AOA {amount.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-emerald-400 font-semibold">
              Desconto {discount}%:
            </span>
            <Badge>AOA {((amount * discount) / 100).toLocaleString()}</Badge>
          </div>
          <div className="pt-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold text-lg">Valor Final:</span>
              <span className="text-white font-bold text-xl">
                AOA {(amount - (amount * discount) / 100).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <Button onClick={onPay}>Pagar Antecipado</Button>
      </CardContent>
    </Card>
  )
}
