import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect } from 'react'

import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { toast } from 'sonner'

import { CadeirasDisponiveis } from './cadeiras-disponiveis'
import { CadeirasRecursoInscritas } from './cadeiras-recurso-inscritas'
import { PaymentAlert } from '@/components/payment-alert'
import { useQueryGetDebit } from '@/hooks/renegotiation/use-query-renegotiation'

export function InscriçõesRecurosPage() {
  const { profileData, isError, isLoading } = useQueryProfile()
  const { data: debit, isLoading: isLoadingDebit } = useQueryGetDebit({
    type: '1',
    enrollmentCode: profileData?.enrollmentCode,
    preinscricao: profileData?.codigo_preinscricao,
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
    return <div>Loading...</div>
  }
  if (debit && (debit?.totalDivida ?? 0) > 0) return <PaymentAlert />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Inscrições para recurso
        </h1>
        <p className="text-muted-foreground mt-2">Inscreva-se em recursos</p>
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
