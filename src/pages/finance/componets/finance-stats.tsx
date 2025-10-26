import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export const FinanceStats = () => (
  <div className="grid gap-6 md:grid-cols-3">
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">90.000,00 Kz</div>
        <p className="text-xs text-muted-foreground">2 meses pagos</p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Pendente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-warning">45.000,00 Kz</div>
        <p className="text-xs text-muted-foreground">Vence em 5 dias</p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Total do Ano</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">540.000,00 Kz</div>
        <p className="text-xs text-muted-foreground">12 mensalidades</p>
      </CardContent>
    </Card>
  </div>
)
