import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Wallet, GraduationCap } from 'lucide-react'

// ** NOVAS IMPORTAÇÕES DO TOOLTIP **
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { useNavigate } from 'react-router-dom'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { DashboardSkeleton } from './components/dashboard-skeleton'
import { formatCurrency } from '@/utils'
import { useQueryStudentDashboardStatistics } from '@/hooks/statics/use-query-student-dashboard-statistics'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { PaymentAlert } from '@/components/payment-alert'

export const Dashboard = () => {
  const { profileData } = useQueryProfile()

  const navigate = useNavigate()
  const { data: statistics, isLoading } = useQueryStudentDashboardStatistics(
    profileData?.enrollmentCode,
  )
  useEffect(() => {
    if ((statistics?.valor_divida ?? 0) > 0) {
      toast.error('Você possui uma dívida pendente!')
    }
  }, [statistics])
  if (!profileData || isLoading) {
    return <DashboardSkeleton />
  }
  if ((statistics?.valor_divida ?? 0) > 0) {
    return <PaymentAlert />
  }
  const greatting = `${profileData.sexo === 'Feminino' ? 'Bem-vinda' : 'Bem-vindo'}, ${profileData.firstName} ${profileData.lastName}`
  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{greatting}</h1>
          <p className="text-muted-foreground">{profileData.course}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
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
                {formatCurrency(statistics?.valor_divida ?? 0)}
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
                {statistics?.quantidade_disciplinas_aprovadas || 0}
              </div>
              {/*<Progress
                value={
                  (statistics?.quantidade_disciplinas_aprovadas || 0) * 100
                }
                className="mt-2"
              />*/}
            </CardContent>
          </Card>
        </div>
        
      
        <TooltipProvider>
          <div className="grid gap-2 grid-cols-3">
           
            <Tooltip>
              <TooltipTrigger asChild>
                <Card
                  onClick={() => navigate('/calendario-academico')}
                  className="cursor-pointer hover:bg-muted transition-colors"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-xl animate-pulse">👉</span>
                      Calendário Acadêmico
                    </CardTitle>
                    <BookOpen className="h-4 w-4 text-primary" />
                  </CardHeader>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ver as **datas de aulas**, matrículas e feriados.</p>
              </TooltipContent>
            </Tooltip>

           
            <Tooltip>
              <TooltipTrigger asChild>
                <Card
                  onClick={() => navigate('/calendario-exames')}
                  className="cursor-pointer hover:bg-muted transition-colors"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-xl animate-pulse">👉</span>
                      Calendário de Exames
                    </CardTitle>
                    <BookOpen className="h-4 w-4 text-primary" />
                  </CardHeader>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Conferir as **datas e horários** das provas.</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
       
      </div>
    </>
  )
}