import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect } from 'react'

import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { toast } from 'sonner'

import { CadeirasDisponiveis } from './cadeiras-disponiveis'
import { CadeirasRecursoInscritas } from './cadeiras-recurso-inscritas'
import { PaymentAlert } from '@/components/payment-alert'
import { useQueryGetDebit } from '@/hooks/renegotiation/use-query-renegotiation'

export function InscriçõesEspecial() {
  const { profileData, isError, isLoading } = useQueryProfile()
  const { data: debit, isLoading: isLoadingDebit } = useQueryGetDebit({
    type: '1',
    enrollmentCode: Number(profileData?.enrollmentCode),
    preinscricao: Number(profileData?.codigo_preinscricao),
  })
  useEffect(() => {
    if (isError) {
      toast.error('Error fetching profile data:')
    }
  }, [isError])

  useEffect(() => {
    if (isError) {
      toast.error('Error fetching profile data:')
    }
  }, [isError])

  if (isLoading || !profileData || isLoadingDebit) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6">
        <div className="relative w-12 h-12">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" className="opacity-10" />
            <circle
              cx="24" cy="24" r="20"
              stroke="currentColor" strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="31.4 94.2"
              className="animate-spin origin-center"
              style={{ animationDuration: '0.85s' }}
            />
          </svg>
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-foreground">A carregar</p>
          <p className="text-xs text-muted-foreground">Por favor aguarde...</p>
        </div>
      </div>
    )
  }
  if (debit && (debit?.totalDivida ?? 0) > 0) return <PaymentAlert />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Inscrições para exames especiais
        </h1>
        <p className="text-muted-foreground mt-2">
          Inscreva-se em exames especiais
        </p>
      </div>

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Cadeiras Disponíveis</TabsTrigger>
          <TabsTrigger value="all">Cadeiras Inscritas</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <CadeirasDisponiveis />
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <CadeirasRecursoInscritas />
        </TabsContent>
      </Tabs>
    </div>
  )
}
