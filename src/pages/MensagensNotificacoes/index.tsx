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
import { Bell, MessageSquare, Megaphone, Calendar, Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'


// --- 1. INTERFACE DE DADOS UNIFICADA ---
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

// --- 2. MOCK DATA E HOOKS DE CONSULTA SIMULADOS (Injeção de Tipo) ---

// Mock de dados da Rota 1: /notificacoes (Geralmente geradas pelo sistema)
const MOCK_NOTIFICACOES_API: Omit<Notification, 'type' | 'priority' | 'category' | 'read'>[] = [
    { id: '2', title: 'Notas Publicadas - Programação I', message: 'As notas da disciplina Programação I foram publicadas. Acesse a seção de Avaliações para visualizar.', date: '2024-12-18', anoLectivo: '2024-2025' },
    { id: '4', title: 'Pagamento Pendente - Propina Janeiro', message: 'A propina do mês de Janeiro vence no dia 31/01/2025. Por favor, efetue o pagamento para evitar bloqueio de serviços.', date: '2024-12-16', anoLectivo: '2024-2025' },
    { id: '7', title: 'Notas Publicadas - Cálculo II', message: 'As notas de Cálculo II foram publicadas.', date: '2024-11-01', anoLectivo: '2023-2024' },
];

// Mock de dados da Rota 2: /comunicacoes (Comunicações ativas: Comunicados e Mensagens)
// Usa 'api_type' para discriminar entre Comunicado e Mensagem se vierem da mesma rota
const MOCK_MENSAGENS_E_COMUNICADOS_API: Omit<Notification, 'priority' | 'category' | 'read'>[] & {api_type: string}[] = [
    { id: '1', type: 'comunicado', title: 'Início do Período de Exames', message: 'O período de exames do 1º semestre terá início no dia 15 de Janeiro de 2025.', date: '2024-12-20', anoLectivo: '2024-2025', api_type: 'comunicado' },
    { id: '3', type: 'mensagem', title: 'Resposta ao Pedido #1234 - Declaração de Matrícula', message: 'O seu pedido foi processado e está disponível para levantamento.', date: '2024-12-17', anoLectivo: '2024-2025', api_type: 'mensagem' },
    { id: '5', type: 'comunicado', title: 'Atualização do Sistema', message: 'O sistema estará em manutenção no dia 25 de Dezembro.', date: '2024-12-15', anoLectivo: '2024-2025', api_type: 'comunicado' },
    { id: '6', type: 'mensagem', title: 'Resposta ao Pedido #1230 - Melhoria de Nota', message: 'O seu pedido de melhoria de nota foi aprovado.', date: '2024-12-14', anoLectivo: '2024-2025', api_type: 'mensagem' },
    { id: '8', type: 'comunicado', title: 'Férias de Natal', message: 'As férias iniciam a 23 de Dezembro.', date: '2023-12-01', anoLectivo: '2023-2024', api_type: 'comunicado' },
];


/**
 * Função de Mapeamento: Normaliza os dados da API para a interface Notification.
 * INJETA o tipo (type) se ele não vier na API (com base na rota).
 */
const mapToNotification = (
    data: any[], 
    typeOverride: 'notificacao' | 'comunicado' | 'mensagem', // Tipo implícito pela ROTA
    idPrefix: string
): Notification[] => {
    return data.map(item => {
        // Usa o 'typeOverride' da rota, ou um campo discriminador que possa vir da API (como api_type)
        // Se a Rota 2 retorna Comunicado E Mensagem, use o campo discriminador da API (item.api_type)
        const finalType = item.api_type || typeOverride; 

        return {
            ...item,
            // INJEÇÃO DO TIPO BASEADO NA ROTA
            type: finalType as Notification['type'], 
            
            // Definição de defaults (Pode ser ajustado conforme a sua regra de negócio)
            priority: item.priority || (finalType === 'notificacao' ? 'high' : 'medium'),
            category: item.category || (finalType === 'notificacao' ? 'notas' : (finalType === 'mensagem' ? 'resposta' : 'geral')),
            read: item.read !== undefined ? item.read : false,
            id: `${idPrefix}-${item.id}`, // Garante ID único entre diferentes rotas
        };
    });
};

// SIMULAÇÃO DO useQuery (para a ROTA 1: /notificacoes)
const useQueryNotificacoes = (anoLectivo: string) => {
    const data = MOCK_NOTIFICACOES_API.filter(item => item.anoLectivo === anoLectivo);
    
    // Injetando 'notificacao'
    return { 
        data: mapToNotification(data, 'notificacao', 'notif'), 
        isLoading: false // Simulando carregamento instantâneo
    };
};

// SIMULAÇÃO DO useQuery (para a ROTA 2: /comunicacoes)
const useQueryComunicadosEMensagens = (anoLectivo: string) => {
    const data = MOCK_MENSAGENS_E_COMUNICADOS_API.filter(item => item.anoLectivo === anoLectivo);

    // Injetando 'comunicado' como tipo base, mas permitindo que 'api_type' (se vier) sobrescreva
    return { 
        data: mapToNotification(data, 'comunicado', 'comm'), 
        isLoading: false // Simulando carregamento instantâneo
    };
};

// --- 3. COMPONENTE PRINCIPAL ---
export const MensagensNotificacoes = () => {
  const [selectedYear, setSelectedYear] = useState('2024-2025')
  
  // 3.1. Chamada às Rotas (Hooks)
  const { data: notificacoesData, isLoading: isLoadingNotificacoes } = 
    useQueryNotificacoes(selectedYear);
    
  const { data: comunicadosEMensagensData, isLoading: isLoadingComunicadosEMensagens } = 
    useQueryComunicadosEMensagens(selectedYear);

  // 3.2. Consolidação e Ordenação
  const allNotifications: Notification[] = [
    ...(notificacoesData || []),
    ...(comunicadosEMensagensData || []),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const isLoading = isLoadingNotificacoes || isLoadingComunicadosEMensagens;
  
  // 3.3. Filtragem para os Separadores
  const comunicados = allNotifications.filter(
    (n) => n.type === 'comunicado',
  )
  const mensagens = allNotifications.filter((n) => n.type === 'mensagem')
  const notificacoes = allNotifications.filter(
    (n) => n.type === 'notificacao',
  )
  
  // --- 4. FUNÇÕES DE AJUDA ---

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
    
  // 5. Renderização de Carregamento
  if (isLoading) {
      return (
          <div className="flex justify-center items-center h-40">
              <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
              <p>A carregar as suas comunicações...</p>
          </div>
      );
  }

  // 6. Renderização Principal
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
            Todos ({allNotifications.length})
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
          {allNotifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  Nenhuma comunicação encontrada para o ano letivo {selectedYear}.
                </p>
              </CardContent>
            </Card>
          ) : (
            allNotifications.map((notification) => (
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