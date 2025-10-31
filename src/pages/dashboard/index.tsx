import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Wallet, GraduationCap } from 'lucide-react'

import { useNavigate } from 'react-router-dom'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { DashboardSkeleton } from './components/dashboard-skeleton'
import { formatCurrency } from '@/utils'

export const Dashboard = () => {
  const { profileData } = useQueryProfile()

  const navigate = useNavigate()

  const studentData = {
    name: 'João Silva',
    courses: [
      { id: 1, name: 'Engenharia Informática', semester: '5º Semestre' },
      {
        id: 2,
        name: 'Gestão de Sistemas de Informação',
        semester: '3º Semestre',
      },
    ],
    currentCourse: 'Engenharia Informática',
    semester: '5º Semestre',
    averageGrade: 15.7,
    attendance: 92,
    muteuCashBalance: 12500.0,
    pendingDebt: 45000.0,
    completedSubjects: 24,
    totalSubjects: 30,
    nextClass: {
      subject: 'Programação Web',
      time: '14:00',
      room: 'Lab 3',
    },
    pendingTasks: 3,
  }

  if (!profileData) {
    return <DashboardSkeleton />
  }

  const greatting = `${profileData.sexo === 'Feminino' ? 'Bem-vinda' : 'Bem-vindo'}, ${profileData.firstName} ${profileData.lastName}`
  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{greatting}</h1>
          <p className="text-muted-foreground">{profileData.course}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {studentData.averageGrade}
              </div>
              <p className="text-xs text-muted-foreground">Em 20 valores</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">MUTEU Cash</CardTitle>
              <Wallet className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(profileData.saldo_actual)}
              </div>
              <p className="text-xs text-muted-foreground">Saldo atual</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:bg-muted transition-colors"
            onClick={() => navigate('/financas')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Dívida Pendente
              </CardTitle>
              <Wallet className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {formatCurrency(profileData.saldo_anterior)}
              </div>
              <p className="text-xs text-muted-foreground">
                Clique para ver detalhes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Disciplinas Concluídas
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {studentData.completedSubjects}/{studentData.totalSubjects}
              </div>
              <Progress
                value={
                  (studentData.completedSubjects / studentData.totalSubjects) *
                  100
                }
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-2 grid-cols-3">
          <Card
            onClick={() => navigate('/calendario-academico')}
            className="cursor-pointer"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Calendário Acadêmico</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
          </Card>
          <Card
            onClick={() => navigate('/calendario-exames')}
            className="cursor-pointer"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Calendário de Exames</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
          </Card>
        </div>
      </div>
    </>
  )
}
