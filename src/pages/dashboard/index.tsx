import { AlertCircle, BookOpen, Calendar, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { HeaderWelcome } from './components/header-welcome'

import { DashboardSkeleton } from './components/dashboard-skeleton'
import { toast } from 'sonner'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'

import { CurriculumCard } from './components/curriculum-card'

export function Dashboard() {
  const {
    error: getProfileError,
    isError: isGetProfileError,
    isLoading: isGetProfileLoading,
    profileData,
  } = useQueryProfile()

  if (isGetProfileLoading || isGetProfileError || !profileData) {
    if (getProfileError) {
      toast.error(getProfileError.message)
    }
    return <DashboardSkeleton />
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <HeaderWelcome
            enrollmentState={profileData.enrollmentState}
            firstName={profileData.firstName}
            lastName={profileData.lastName}
            gender={profileData.gender}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Frequência</CardTitle>
              <Calendar className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <Progress value={0} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Próxima Aula
              </CardTitle>
              <Clock className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">N/A</div>
              <p className="text-xs text-muted-foreground">N/A</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tarefas Pendentes
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Para entregar esta semana
              </p>
            </CardContent>
          </Card>
        </div>

        <CurriculumCard preEnrollmentCode={profileData.preEnrollmentCode} />
      </div>
    </>
  )
}
