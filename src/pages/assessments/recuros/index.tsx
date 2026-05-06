import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect } from 'react'

import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { toast } from 'sonner'

import { CadeirasDisponiveis } from './cadeiras-disponiveis'
import { CadeirasRecursoInscritas } from './cadeiras-recurso-inscritas'

export function InscriçõesRecurosPage() {
  const { profileData, isError, isLoading } = useQueryProfile()

  useEffect(() => {
    if (isError) {
      toast.error('Error fetching profile data:')
    }
  }, [isError])

  if (isLoading || !profileData) {
    return <div>Loading...</div>
  }

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
