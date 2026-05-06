import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect } from 'react'

import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { toast } from 'sonner'

import { useQueryCurrentAcademicYear } from '@/hooks/academic-year/use-query-current-academic-year'
import { PaymentAlert } from '@/components/payment-alert'
import { useQueryGetDebit } from '@/hooks/renegotiation/use-query-renegotiation'
import { GradeCurrentAcademicYear } from '../grade CurrentAcademicYear'
import { CurriculumCard } from '../curriculum-card'
import { CadeirasDisponiveis } from './cadeiras-disponiveis'
import { useQueryCadeirasRecuros } from '@/hooks/assessments/recursos'

export function InscriçõesRecurosPage() {
   const { profileData, isError, isLoading } = useQueryProfile()
  const { data: academicYearData } = useQueryCurrentAcademicYear()
 

  useEffect(() => {
    if (isError) {
      toast.error('Error fetching profile data:')
    }
  }, [isError])

  if (isLoading || !profileData) {
    return <div>Loading...</div>
  }

  const enrollmentCode = profileData?.codigo_matricula
  const classe = profileData?.confirmacoes[0]?.classe
  const academicYear =
    academicYearData?.codigo || profileData?.confirmacoes[0]?.ano_lectivo
  const preEnrollmentCode = profileData?.preEnrollmentCode

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inscrições para recurso</h1>
        <p className="text-muted-foreground mt-2">
          Inscreva-se em recursos
        </p>
      </div>

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Cadeiras Disponíveis</TabsTrigger>
          <TabsTrigger value="all">Cadeiras Inscritas</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <CadeirasDisponiveis
            
          />
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <CurriculumCard
            preEnrollmentCode={preEnrollmentCode}
            enrollmentCode={enrollmentCode}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}