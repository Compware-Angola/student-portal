import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, TrendingDown, Calendar, CreditCard } from 'lucide-react'

export function AdvancePayment() {
  const plans = [
    {
      id: 1,
      name: 'Pagamento Semestral',
      months: 6,
      discount: 5,
      normalPrice: 270000,
      discountedPrice: 256500,
      savings: 13500,
      features: [
        '6 meses de antecedência',
        '5% de desconto',
        'Sem taxas adicionais',
        'Garantia de vaga',
      ],
    },
    {
      id: 2,
      name: 'Pagamento Anual',
      months: 12,
      discount: 10,
      normalPrice: 540000,
      discountedPrice: 486000,
      savings: 54000,
      features: [
        '12 meses de antecedência',
        '10% de desconto',
        'Sem taxas adicionais',
        'Garantia de vaga',
        'Prioridade na escolha de horários',
        'Material didático incluso',
      ],
      recommended: true,
    },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 2,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Pagamento Antecipado
        </h1>
        <p className="text-muted-foreground">
          Economize pagando suas mensalidades antecipadamente
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Mensalidade Normal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.000,00 Kz</div>
            <p className="text-xs text-muted-foreground">Por mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Maior Desconto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">10%</div>
            <p className="text-xs text-muted-foreground">Pagamento anual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Economia Máxima
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">54.000,00 Kz</div>
            <p className="text-xs text-muted-foreground">No plano anual</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={plan.recommended ? 'border-primary shadow-lg' : ''}
          >
            {plan.recommended && (
              <div className="flex justify-center relative">
                <Badge className="absolute -top-3 bg-primary text-primary-foreground">
                  Recomendado
                </Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {plan.name}
                <Badge variant="outline" className="bg-success/10 text-success">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  {plan.discount}% OFF
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    {formatCurrency(plan.discountedPrice)}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground line-through">
                    {formatCurrency(plan.normalPrice)}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    Economize {formatCurrency(plan.savings)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 rounded-lg bg-muted p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Período
                  </span>
                  <span className="font-medium">{plan.months} meses</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Valor mensal
                  </span>
                  <span className="font-medium">
                    {formatCurrency(plan.discountedPrice / plan.months)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                variant={plan.recommended ? 'default' : 'outline'}
              >
                Escolher Plano
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Como Funciona</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                1
              </div>
              <div>
                <h3 className="font-semibold">Escolha seu plano</h3>
                <p className="text-sm text-muted-foreground">
                  Selecione entre pagamento semestral ou anual de acordo com sua
                  preferência
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                2
              </div>
              <div>
                <h3 className="font-semibold">Realize o pagamento</h3>
                <p className="text-sm text-muted-foreground">
                  Efetue o pagamento via transferência bancária ou no balcão da
                  tesouraria
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                3
              </div>
              <div>
                <h3 className="font-semibold">Aproveite os benefícios</h3>
                <p className="text-sm text-muted-foreground">
                  Seu desconto será aplicado automaticamente e você terá
                  garantia de vaga durante todo o período
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
