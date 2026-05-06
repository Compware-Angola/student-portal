import { Card, CardContent } from '@/components/ui/card'
import {  Loader2} from 'lucide-react'

export const ExamLoader = () => {
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
                <Loader2 className="h-10 w-10 text-primary" />
              </div>
            </div>

            <p className="text-base">Processando, aguarde...</p>

          </CardContent>
        </Card>
      </div>
    </>
  )
}
