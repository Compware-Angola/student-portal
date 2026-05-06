import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect } from 'react'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { toast } from 'sonner'
import { CurriculumCard } from './curriculum-card'
import { PaymentAlert } from '@/components/payment-alert'
import { useQueryGetDebit } from '@/hooks/renegotiation/use-query-renegotiation'
import { Notes } from './notes'

export function Assessments() {
  const { profileData, isError, isLoading } = useQueryProfile()

  const { data: debit, isLoading: isLoadingDebit } = useQueryGetDebit({
    type: '1',
    enrollmentCode: Number(profileData?.enrollmentCode),
    preinscricao: Number(profileData?.preEnrollmentCode),
  })
  useEffect(() => {
    if (isError) {
      toast.error('Error fetching profile data:')
    }
  }, [isError])

  if (isLoading || !profileData || isLoadingDebit) {
    return <div>Loading...</div>
  }
  if (debit && (debit?.totalDivida ?? 0) > 0) return <PaymentAlert />

  const enrollmentCode = profileData?.codigo_matricula
  const preEnrollmentCode = profileData?.preEnrollmentCode

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Avaliações</h1>
        <p className="text-muted-foreground mt-2">
          Consulte suas notas e acompanhe seu desempenho acadêmico
        </p>
      </div>

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Avaliações do Ano Corrente</TabsTrigger>
          <TabsTrigger value="all">Todas as Notas Finais</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <Notes
            
            codigoMatricula={enrollmentCode}
          />
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <CurriculumCard
            preEnrollmentCode={preEnrollmentCode?.toString()}
            enrollmentCode={enrollmentCode?.toString()}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
