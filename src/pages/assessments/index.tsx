import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect } from 'react'
import { GradeCurrentAcademicYear } from './grade CurrentAcademicYear'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { toast } from 'sonner'
import { CurriculumCard } from './curriculum-card'
import { useQueryCurrentAcademicYear } from '@/hooks/academic-year/use-query-current-academic-year'
import { PaymentAlert } from '@/components/payment-alert'
import { useQueryGetDebit } from '@/hooks/renegotiation/use-query-renegotiation'

export function Assessments() {
  const { profileData, isError, isLoading } = useQueryProfile()
  const { data: academicYearData } = useQueryCurrentAcademicYear()
  const { data: debit, isLoading: isLoadingDebit } = useQueryGetDebit({
    type: '1',
    enrollmentCode: profileData?.enrollmentCode,
    preinscricao: String(profileData?.codigo_preinscricao),
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
  const classe = profileData?.confirmacoes[0]?.classe
  const academicYear =
    academicYearData?.codigo || profileData?.confirmacoes[0]?.ano_lectivo
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
          <GradeCurrentAcademicYear
            academicYear={academicYear}
            classe={classe}
            enrollmentCode={enrollmentCode}
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
