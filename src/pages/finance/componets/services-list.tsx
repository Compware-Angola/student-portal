import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Receipt } from 'lucide-react'
import { useFinance } from '../hooks/use-finance'

export function ServicesList() {
  const { payments, getStatusBadge, handleGenerateReference } = useFinance()



  // Vou listar Todos os pagamentos como "Serviços"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {payments.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <div>
              <p className="font-medium">{p.month}</p>
              <p className="text-sm text-muted-foreground">
                Vencimento: {new Date(p.dueDate).toLocaleDateString('pt-AO')}
              </p>
              {p.reference && (
                <p className="text-xs text-muted-foreground">
                  Referência: {p.reference}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right space-y-2">
                <p className="font-bold">{p.amount}</p>
                {getStatusBadge(p.status)}
              </div>
              {!p.reference && p.status !== 'paid' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGenerateReference(p.id)}
                >
                  <Receipt className="mr-2 h-4 w-4" /> Gerar Referência
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
