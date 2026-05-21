'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Bell,
  CalendarDays,
  Clock,
  Wallet,
  GraduationCap,
  Calendar,
  AlertCircle,
  Hourglass,
  ArrowRight,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { DashboardSkeleton } from './components/dashboard-skeleton'
import { formatCurrency } from '@/utils'

import {
  useQueryAnnouncement,
  useQueryMessage,
} from '@/hooks/message_and_announcement/use-query-message_and_announcement'
import { AuthStorage } from '@/storage/auth-storage'
import { useQueryAcademicActivity } from '@/hooks/academic/use-query-academic-activity'
import { useQueryAcademicTestSchedule } from '@/hooks/schedule/use-query-academic-test-schedule'

import { CompletedSubjectsCard } from './components/completed-subjects-card'
import { useQueryCurrentAcademicYear } from '@/hooks/academic-year/use-query-current-academic-year'
import { Button } from '@/components/ui/button'
import { MonthlyCard } from './components/monthly-card'

// === Tipos ===
interface Notification {
  id: string
  type: 'mensagem' | 'comunicado' | 'exam' | 'grade' | 'payment'
  title: string
  message: string
  date: string
  read: boolean
  priority: 'high' | 'medium' | 'low'
  respostas?: { mensagem_resposta?: string; data_resposta?: string } | null
}

export const Dashboard = () => {

  const authData = AuthStorage.get()
  const { profileData } = useQueryProfile()
  const userId = authData?.user_id ?? profileData?.userId ?? ''
  const pre_inscricao = profileData?.codigo_preinscricao
  const navigate = useNavigate()

  // === Hooks com Loading ===
  const { data: mensagens, isLoading: loadingMensagens } = useQueryMessage({
    userId: userId.toString(),
  })
  const { data: comunicados, isLoading: loadingComunicados } =
    useQueryAnnouncement({ pre_inscricao })
  const { data: academicYear } = useQueryCurrentAcademicYear()
  const { data: atividades = [], isLoading: loadingAtividades } =
    useQueryAcademicActivity({
      academicYear: academicYear?.codigo,
      applicationType: profileData?.codigo_tipo_candidatura,
    })
  const { data: exams = [], isLoading: loadingExams } =
    useQueryAcademicTestSchedule({
      academicYear: academicYear?.codigo,
      semester: '1',
      enrollmentCode: profileData?.enrollmentCode,
    })

  const greeting = `${profileData?.sexo === 'Feminino' ? 'Bem-vinda' : 'Bem-vindo'}, ${profileData?.firstName} ${profileData?.lastName}`
  const confirmationYear = profileData?.confirmacoes?.[0]?.ano_lectivo;

  // === Normalização ===
  const normalizedMensagens: Notification[] = (mensagens || []).map((item) => ({
    id: item.contactos_id,
    type: 'mensagem' as const,
    title: item.assunto ?? 'Sem assunto',
    message: item.mensagem ?? '',
    date: item.data_mensagem,
    read: item.status_mensagem === 'respondido',
    priority: 'medium' as const,
    respostas: item.resposta ?? null,
  }))

  const normalizedComunicados: Notification[] = (comunicados || []).map(
    (item) => ({
      id: item.notificacao_id,
      type: 'comunicado' as const,
      title: item.assunto ?? 'Sem assunto',
      message: item.descricao ?? '',
      date: item.data_notificacao,
      read: false,
      priority: 'low' as const,
      respostas: null,
    }),
  )

  // === Últimos itens (ordenados) ===
  const latestMensagens = [...normalizedMensagens]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  const latestComunicados = [...normalizedComunicados]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  const latestCalendar = [...(atividades || [])]
    .sort(
      (a, b) =>
        new Date(b.data_inicio).getTime() - new Date(a.data_inicio).getTime(),
    )
    .slice(0, 2)

  const latestExams = [...exams]
    .sort(
      (a, b) =>
        new Date(b.hora_prova).getTime() - new Date(a.hora_prova).getTime(),
    )
    .slice(0, 2)

  const hasNotifications =
    latestMensagens.length > 0 || latestComunicados.length > 0
  const hasCalendar = latestCalendar.length > 0
  const hasExams = latestExams.length > 0

  // === Funções auxiliares ===
  const getIcon = (type: string) => {
    const iconClass = 'h-4 w-4'
    switch (type) {
      case 'exam':
        return <CalendarDays className={`${iconClass} text-blue-600`} />
      case 'grade':
        return <GraduationCap className={`${iconClass} text-green-600`} />
      case 'payment':
        return <Wallet className={`${iconClass} text-yellow-600`} />
      case 'mensagem':
        return <Bell className={`${iconClass} text-purple-600`} />
      default:
        return <Bell className={`${iconClass} text-gray-600`} />
    }
  }

  const getPriorityColor = (
    priority: string,
  ): 'destructive' | 'default' | 'secondary' => {
    return priority === 'high'
      ? 'destructive'
      : priority === 'medium'
        ? 'default'
        : 'secondary'
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  if (!profileData) return <DashboardSkeleton />

  return (
    <div className="space-y-6">


      {/* Saudação */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{greeting}</h1>
        <p className="text-muted-foreground">{profileData.course}</p>
      </div>
      {(profileData.estado_aluno !== "DIPLOMADO" && profileData.confirmacoes?.length === 0 || profileData.confirmacoes[0]?.estado === 0) && (
        <Card className="border-l-4 border-l-amber-500 bg-amber-500/5">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex h-11 w-11 items-center justify-center rounded-lg bg-amber-500/15 shrink-0">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-amber-500 hover:bg-amber-500 text-white gap-1">
                    <Hourglass className="h-3 w-3" />
                    Inscrição por confirmar
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Estado: <strong className="text-foreground">Pendente</strong>
                  </span>
                </div>
                <h3 className="text-base font-semibold leading-snug">
                  A sua inscrição ainda não foi confirmada
                </h3>
                <p className="text-sm text-muted-foreground">
                  Para activar o seu acesso completo (horários, avaliações e disciplinas), é necessário concluir os seguintes passos:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 pl-1">
                  <li>Efectuar o pagamento da taxa de inscrição.</li>
                </ul>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button size="sm" onClick={() => navigate("/financas")} className="gap-1.5">
                    <Wallet className="h-4 w-4" />
                    Regularizar pagamento
                  </Button>

                  <Button size="sm" variant="ghost" onClick={() => navigate("/suporte")} className="gap-1.5">
                    Contactar Suporte
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Carteira Digital
            </CardTitle>
            <Wallet className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(profileData.saldo_reset)}
            </div>
            <p className="text-xs text-muted-foreground">Saldo atual</p>
          </CardContent>
        </Card>

        {/* <DebtCard
          onClick={() => navigate('/financas')}
          enrollmentCode={profileData.enrollmentCode}
          preinscricao={profileData.codigo_preinscricao}
        /> */}
        <MonthlyCard
          onClick={() => navigate('/financas')}
          enrollmentCode={profileData.enrollmentCode}
          selectedYear={confirmationYear}
        />
        <CompletedSubjectsCard enrollmentCode={profileData.enrollmentCode} />
      </div>

      {/* Mensagens + Calendários */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Mensagens e Comunicados */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Mensagens e Comunicados
            </CardTitle>
            {hasNotifications && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate('/mensagens')}
              >
                Ver mais
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {loadingMensagens || loadingComunicados ? (
              <p className="text-center text-muted-foreground py-6">
                Carregando...
              </p>
            ) : hasNotifications ? (
              <div className="space-y-3">
                {latestMensagens.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer ${!msg.read ? 'border-l-4 border-l-primary' : ''
                      }`}
                    onClick={() => navigate('/mensagens')}
                  >
                    <div className="mt-1">{getIcon(msg.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm line-clamp-1">
                          {msg.title}
                        </h4>
                        <Badge
                          variant={getPriorityColor(msg.priority)}
                          className="text-xs"
                        >
                          Mensagem
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {msg.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(msg.date)}
                      </p>
                      {msg.respostas?.mensagem_resposta && (
                        <p className="text-xs text-primary mt-1 italic">
                          Resposta enviada
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {latestComunicados.map((com) => (
                  <div
                    key={com.id}
                    className="flex gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => navigate('/mensagens')}
                  >
                    <div className="mt-1">{getIcon(com.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm line-clamp-1">
                          {com.title}
                        </h4>
                        <Badge
                          variant={getPriorityColor(com.priority)}
                          className="text-xs"
                        >
                          Comunicado
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {com.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(com.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">
                Nenhuma notificação disponível.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Calendários */}
        <div className="space-y-6">
          {/* Calendário Acadêmico */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Calendário Acadêmico
              </CardTitle>
              {hasCalendar && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate('/calendario-academico')}
                >
                  Ver mais
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {loadingAtividades ? (
                <p className="text-center text-muted-foreground py-4">
                  Carregando...
                </p>
              ) : hasCalendar ? (
                <div className="space-y-3">
                  {latestCalendar.map((event) => (
                    <div
                      key={event.codigo}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => navigate('/calendario-academico')}
                    >
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium text-sm">
                          {event.descricao}
                        </h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
                          <span>
                            {new Date(event.data_inicio).toLocaleDateString(
                              'pt-PT',
                              {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              },
                            )}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                          <span>
                            {new Date(event.data_termino).toLocaleDateString(
                              'pt-PT',
                              {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              },
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum evento próximo.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Calendário de Provas */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Calendário de Provas
              </CardTitle>
              {hasExams && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate('/calendario-exames')}
                >
                  Ver mais
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {loadingExams ? (
                <p className="text-center text-muted-foreground py-4">
                  Carregando...
                </p>
              ) : hasExams ? (
                <div className="space-y-3">
                  {latestExams.map((exam) => (
                    <div
                      key={exam.codigo}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => navigate('/calendario-exames')}
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">
                          {exam.disciplina}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-xs text-muted-foreground">
                            {new Date(exam.data_prova).toLocaleDateString(
                              'pt-PT',
                              {
                                day: 'numeric',
                                month: 'long',
                              },
                            )}{' '}
                            às {exam.hora_termino}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {exam.sala}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Nenhuma prova agendada.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
