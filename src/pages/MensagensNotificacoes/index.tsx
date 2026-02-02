import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Megaphone, Loader2 } from 'lucide-react'
import {
  useQueryAnnouncement,
  useQueryMessage,
} from '@/hooks/message_and_announcement/use-query-message_and_announcement'
import type { DetalheResposta } from '@/services/message_and_announcement/message_and_announcement.service'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { AuthStorage } from '@/storage/auth-storage'

export type Notification = {
  id: string
  type: 'mensagem' | 'comunicado'
  title: string
  message: string
  date: string
  read: boolean
  priority: 'medium' | 'low'
  respostas: DetalheResposta | null
}

export const MensagensNotificacoes = () => {
  const authData = AuthStorage.get()
  const { profileData, error: profileError } = useQueryProfile()
  const userId = authData?.user_id ?? profileData?.userId ?? ''
  const pre_inscricao = profileData?.codigo_preinscricao ?? ''
  const { data: comunicados, isLoading: isLoadingComunicados } =
    useQueryAnnouncement({ pre_inscricao })
  // ← aqui lê o localStorage
  const { data: mensagens, isLoading: isLoadingMensagens } = useQueryMessage({
    userId: userId.toString(),
  })

  if (profileError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro ao pegar Perfil</CardTitle>
        </CardHeader>
        <CardContent>Ops !</CardContent>
      </Card>
    )
  }

  // ✅ Busca COMUNICADOS

  // ✅ Normaliza MENSAGENS
  const normalizedMensagens: Notification[] = mensagens.map((item) => ({
    id: item.contactos_id,
    type: 'mensagem',
    title: item.assunto ?? 'Sem assunto',
    message: item.mensagem ?? '',
    date: item.data_mensagem,
    read: item.status_mensagem === 'respondido',
    priority: 'medium',
    respostas: item.resposta ?? null,
  }))

  // ✅ Normaliza COMUNICADOS
  const normalizedComunicados: Notification[] = comunicados.map((item) => ({
    id: item.notificacao_id,
    type: 'comunicado',
    title: item.assunto ?? 'Sem assunto',
    message: item.descricao ?? '',
    date: item.data_notificacao,
    read: false,
    priority: 'low',
    respostas: null,
  }))

  const isLoading = isLoadingMensagens || isLoadingComunicados

  const getPriorityColor = (priority: 'medium' | 'low') => {
    return priority === 'medium' ? 'default' : 'secondary'
  }

  const getIcon = (type: 'mensagem' | 'comunicado') => {
    return type === 'mensagem' ? (
      <MessageSquare className="h-5 w-5" />
    ) : (
      <Megaphone className="h-5 w-5" />
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
        <p>A carregar as suas comunicações...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mensagens e Comunicados</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe todas as comunicações da universidade
          </p>
        </div>
        {/*
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ano Lectivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-2025">2024-2025</SelectItem>
              <SelectItem value="2023-2024">2023-2024</SelectItem>
              <SelectItem value="2022-2023">2022-2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
   */}
      </div>

      <Tabs defaultValue="mensagens" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mensagens">
            Mensagens ({normalizedMensagens.length})
          </TabsTrigger>
          <TabsTrigger value="comunicados">
            Comunicados ({normalizedComunicados.length})
          </TabsTrigger>
        </TabsList>

        {/* Aba de Mensagens */}
        <TabsContent value="mensagens" className="space-y-4 mt-6">
          {normalizedMensagens.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nenhuma mensagem disponível.
            </p>
          ) : (
            normalizedMensagens
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime(),
              )
              .map((msg) => (
                <Card
                  key={msg.id}
                  className={!msg.read ? 'border-l-4 border-l-primary' : ''}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getIcon(msg.type)}
                        <div>
                          <CardTitle className="text-base">
                            {msg.title}
                          </CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {new Date(msg.date).toLocaleDateString('pt-PT', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={getPriorityColor(msg.priority)}>
                        Normal
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {/* ✅ MENSAGEM PRINCIPAL */}
                    <p className="text-sm text-muted-foreground mb-3">
                      {msg.message}
                    </p>

                    {/* ✅ EXIBE RESPOSTAS */}
                    <div className="space-y-3 pl-4 border-l-2 border-primary">
                      {msg.respostas ? (
                        <div className="bg-muted p-3 rounded-md">
                          <p className="text-sm font-medium">Resposta:</p>
                          <p className="text-sm text-muted-foreground">
                            {msg.respostas.mensagem_resposta ?? 'Sem resposta'}
                          </p>

                          {msg.respostas.data_resposta && (
                            <p className="text-[12px] text-muted-foreground mt-2">
                              {new Date(
                                msg.respostas.data_resposta,
                              ).toLocaleDateString('pt-PT', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="bg-muted p-3 rounded-md">
                          <p className="text-sm font-medium">Resposta:</p>
                          <p className="text-sm text-muted-foreground">
                            Sem resposta
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>

        {/* Aba de Comunicados */}
        <TabsContent value="comunicados" className="space-y-4 mt-6">
          {normalizedComunicados.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nenhum comunicado disponível.
            </p>
          ) : (
            normalizedComunicados
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime(),
              )
              .map((com) => (
                <Card key={com.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getIcon(com.type)}
                        <div>
                          <CardTitle className="text-base">
                            {com.title}
                          </CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {new Date(com.date).toLocaleDateString('pt-PT', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={getPriorityColor(com.priority)}>
                        Baixa
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {com.message}
                    </p>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
