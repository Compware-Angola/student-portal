import { Card, CardContent } from '@/components/ui/card'
import { ClipboardList } from 'lucide-react'

export const ExamPendingInfo = () => {
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
                <ClipboardList className="h-10 w-10 text-primary" />
              </div>
            </div>

            <h2 className="text-2xl font-bold">Aguardando atribuição de prova</h2>

            <p className="text-muted-foreground">
              O seu pagamento foi confirmado com sucesso.
            </p>

            <p className="text-muted-foreground">
              No entanto, ainda não lhe foi atribuída uma prova.
            </p>

            <p className="text-sm text-muted-foreground">
              Assim que a atribuição for efectuada, poderá consultar aqui a
              data, hora e local da sua prova. Por favor, verifique
              periodicamente esta página.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}