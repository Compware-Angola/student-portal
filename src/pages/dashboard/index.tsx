import { AlertCircle, BookOpen, Calendar, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { HeaderWelcome } from './components/header-welcome'
import { PaymentAlert } from '@/components/payment-alert'
import { RenegociateAlert } from '@/components/renegociate-alert'

export function Dashboard() {
  const studentData = {
    name: 'João Silva',
    course: 'Engenharia Informática',
    semester: '5º Semestre',
    averageGrade: 15.7,
    attendance: 92,
    nextClass: {
      subject: 'Programação Web',
      time: '14:00',
      room: 'Lab 3',
    },
    pendingTasks: 3,
  }

  return <PaymentAlert/>

  return (
    <>
      <div className="space-y-6">
        <div>
          <HeaderWelcome />
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
              <CardTitle className="text-sm font-medium">Frequência</CardTitle>
              <Calendar className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {studentData.attendance}%
              </div>
              <Progress value={studentData.attendance} className="mt-2" />
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
              <div className="text-2xl font-bold">
                {studentData.nextClass.time}
              </div>
              <p className="text-xs text-muted-foreground">
                {studentData.nextClass.subject}
              </p>
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
              <div className="text-2xl font-bold">
                {studentData.pendingTasks}
              </div>
              <p className="text-xs text-muted-foreground">
                Para entregar esta semana
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Avisos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-warning" />
                  <div>
                    <p className="text-sm font-medium">Prazo de Matrícula</p>
                    <p className="text-xs text-muted-foreground">
                      A renovação de matrícula termina em 5 dias
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-info" />
                  <div>
                    <p className="text-sm font-medium">
                      Novo Material Disponível
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Slides da aula de Bases de Dados foram publicados
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Horário de Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">Programação Web</p>
                    <p className="text-sm text-muted-foreground">
                      14:00 - 16:00
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Lab 3
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">Sistemas Operativos</p>
                    <p className="text-sm text-muted-foreground">
                      16:00 - 18:00
                    </p>
                  </div>
                  <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                    Sala 205
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
