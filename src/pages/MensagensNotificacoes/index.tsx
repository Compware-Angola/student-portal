import { useState } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Bell, MessageSquare, Megaphone, Calendar } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Notification {
  id: string
  type: 'comunicado' | 'mensagem' | 'notificacao'
  title: string
  message: string
  date: string
  priority: 'high' | 'medium' | 'low'
  category: 'notas' | 'pagamento' | 'geral' | 'resposta'
  anoLectivo: string
  read: boolean
}

export const MensagensNotificacoes = () => {
  const [selectedYear, setSelectedYear] = useState('2024-2025')

  // Mock data
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'comunicado',
      title: 'Início do Período de Exames',
      message:
        'O período de exames do 1º semestre terá início no dia 15 de Janeiro de 2025. Consulte o calendário completo no portal académico.',
      date: '2024-12-20',
      priority: 'high',
      category: 'geral',
      anoLectivo: '2024-2025',
      read: false,
    },
    {
      id: '2',
      type: 'notificacao',
      title: 'Notas Publicadas - Programação I',
      message:
        'As notas da disciplina Programação I foram publicadas. Acesse a seção de Avaliações para visualizar.',
      date: '2024-12-18',
      priority: 'high',
      category: 'notas',
      anoLectivo: '2024-2025',
      read: false,
    },
    {
      id: '3',
      type: 'mensagem',
      title: 'Resposta ao Pedido #1234 - Declaração de Matrícula',
      message:
        'O seu pedido de declaração de matrícula foi processado e está disponível para levantamento no Departamento de Serviços Académicos.',
      date: '2024-12-17',
      priority: 'medium',
      category: 'resposta',
      anoLectivo: '2024-2025',
      read: true,
    },
    {
      id: '4',
      type: 'notificacao',
      title: 'Pagamento Pendente - Propina Janeiro',
      message:
        'A propina do mês de Janeiro vence no dia 31/01/2025. Por favor, efetue o pagamento para evitar bloqueio de serviços.',
      date: '2024-12-16',
      priority: 'high',
      category: 'pagamento',
      anoLectivo: '2024-2025',
      read: false,
    },
    {
      id: '5',
      type: 'comunicado',
      title: 'Atualização do Sistema de Gestão Académica',
      message:
        'Informamos que o sistema estará em manutenção no dia 25 de Dezembro das 00h às 06h. Durante este período, o portal pode ficar indisponível.',
      date: '2024-12-15',
      priority: 'medium',
      category: 'geral',
      anoLectivo: '2024-2025',
      read: true,
    },
    {
      id: '6',
      type: 'mensagem',
      title: 'Resposta ao Pedido #1230 - Melhoria de Nota',
      message:
        'O seu pedido de melhoria de nota foi aprovado. O pagamento pode ser efetuado através do MUTEU Cash ou transferência bancária.',
      date: '2024-12-14',
      priority: 'medium',
      category: 'resposta',
      anoLectivo: '2024-2025',
      read: true,
    },
  ]

  const filteredNotifications = notifications.filter(
    (n) => n.anoLectivo === selectedYear,
  )

  const comunicados = filteredNotifications.filter(
    (n) => n.type === 'comunicado',
  )
  const mensagens = filteredNotifications.filter((n) => n.type === 'mensagem')
  const notificacoes = filteredNotifications.filter(
    (n) => n.type === 'notificacao',
  )

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'default'
      case 'low':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'comunicado':
        return <Megaphone className="h-5 w-5" />
      case 'mensagem':
        return <MessageSquare className="h-5 w-5" />
      case 'notificacao':
        return <Bell className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const NotificationCard = ({
    notification,
  }: {
    notification: Notification
  }) => (
    <Card
      className={`${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getIcon(notification.type)}
            <div>
              <CardTitle className="text-base">{notification.title}</CardTitle>
              <CardDescription className="text-sm mt-1">
                {new Date(notification.date).toLocaleDateString('pt-PT', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant={getPriorityColor(notification.priority)}>
              {notification.priority === 'high'
                ? 'Urgente'
                : notification.priority === 'medium'
                  ? 'Normal'
                  : 'Baixa'}
            </Badge>
            {!notification.read && <Badge variant="outline">Novo</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mensagens e Comunicados</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe todas as comunicações da universidade
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ano Letivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-2025">2024-2025</SelectItem>
              <SelectItem value="2023-2024">2023-2024</SelectItem>
              <SelectItem value="2022-2023">2022-2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todos">
            Todos ({filteredNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="comunicados">
            Comunicados ({comunicados.length})
          </TabsTrigger>
          <TabsTrigger value="mensagens">
            Mensagens ({mensagens.length})
          </TabsTrigger>
          <TabsTrigger value="notificacoes">
            Notificações ({notificacoes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4 mt-6">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  Nenhuma mensagem ou comunicado encontrado
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="comunicados" className="space-y-4 mt-6">
          {comunicados.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  Nenhum comunicado encontrado
                </p>
              </CardContent>
            </Card>
          ) : (
            comunicados.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="mensagens" className="space-y-4 mt-6">
          {mensagens.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  Nenhuma mensagem encontrada
                </p>
              </CardContent>
            </Card>
          ) : (
            mensagens.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-4 mt-6">
          {notificacoes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  Nenhuma notificação encontrada
                </p>
              </CardContent>
            </Card>
          ) : (
            notificacoes.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
