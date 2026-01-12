import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQueryCurriculumPlan } from '@/hooks/curriculum/use-query-curriculum-plan'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'


import { FilteredByClass } from './filterd-by-class'
import { Spinner } from '@/components/ui/spinner'
import { StudentCurriculum } from './student-curriculum'

export const DisciplinasMatriculadas = () => {
  const {
    profileData,
    isLoading: isLoandingProfileData,
    isError: errorProfileData,
  } = useQueryProfile()

  const { isLoading, isError } = useQueryCurriculumPlan(
    {
      class: profileData?.confirmacoes?.[0]?.classe,
      course: profileData?.codigo_curso,
    },
    true,
  )

  if (isLoading || isLoandingProfileData) {
    return <Spinner className="mx-auto my-8" />
  }
  if (isError || errorProfileData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro ao pegar a Grade</CardTitle>
        </CardHeader>
        <CardContent>Ops !</CardContent>
      </Card>
    )
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Disciplinas Matriculadas</h1>
        <p className="text-muted-foreground mt-2">
          Consulte as suas disciplinas e planos de estudo
        </p>
      </div>

      <Tabs defaultValue="atual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="atual">Ano Atual</TabsTrigger>
          <TabsTrigger value="class">Grade Curricular</TabsTrigger>
        </TabsList>

        <TabsContent value="atual" className="space-y-6 mt-6">
          <StudentCurriculum profileData={profileData!} />
        </TabsContent>

        <TabsContent value="class" className="space-y-6 mt-6">
          <FilteredByClass profileData={profileData ?? undefined} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
