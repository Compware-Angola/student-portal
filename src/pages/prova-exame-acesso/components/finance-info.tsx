import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Info, Wallet } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const FinanceInfo = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full mx-auto animate-fade-in">
        <Card>
          <CardContent className="p-10 text-center space-y-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <div
                style={{
                  animation: 'spin 2s ease-in-out infinite',
                }}
                className="relative"
              >
                <Info className="h-10 w-10 text-primary" />
              </div>
            </div>

            <h2 className="text-2xl font-bold">Pagamento pendente</h2>

            <p className="text-muted-foreground">
              A sua pré-inscrição foi registada com sucesso.
            </p>

            <p className="text-muted-foreground">
              No entanto, ainda não foi identificado o pagamento da taxa de
              admissão.
            </p>

            <p className="text-sm text-muted-foreground">
              Por favor, dirija-se à área de <strong>Pagamentos</strong> e
              efectue o pagamento antes da data da prova para garantir a sua
              participação.
            </p>
            <div>
              <Button
                onClick={() => navigate('/pre-pagamento')}
                className="flex-1"
                variant="outline"
                aria-label="Descarregar PDF"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Ir para Pagamentos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
