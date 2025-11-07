import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect } from 'react'
import { GradeCurrentAcademicYear } from './grade CurrentAcademicYear'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { toast } from 'sonner'
import { CurriculumCard } from './curriculum-card'
import { useQueryCurrentAcademicYear } from '@/hooks/academic-year/use-query-current-academic-year'

export function Assessments() {
  const { profileData, isError, isLoading } = useQueryProfile()
  const {data:academicYearData}=useQueryCurrentAcademicYear()

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
  const academicYear = academicYearData?.codigo||profileData?.confirmacoes[0]?.ano_lectivo
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
          <CurriculumCard preEnrollmentCode={preEnrollmentCode} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
