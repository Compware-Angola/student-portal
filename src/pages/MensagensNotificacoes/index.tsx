import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Megaphone, Loader2, Download } from 'lucide-react'
import {
  useQueryAnnouncement,
  useQueryMessage,
} from '@/hooks/message_and_announcement/use-query-message_and_announcement'
import type { DetalheResposta } from '@/services/message_and_announcement/message_and_announcement.service'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { AuthStorage } from '@/storage/auth-storage'
import { buildImageAssets } from '@/utils/build-image-assets'

import { Button } from '@/components/ui/button'
import { useQueryAvisosPorGrupo } from '@/hooks/use-query-aviso-por-grupos'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export type Notification = {
  id: string
  type: 'mensagem' | 'comunicado' | 'aviso'
  title: string
  message: string
  date: string
  read: boolean
  priority: 'medium' | 'low'
  respostas: DetalheResposta | null
  fileName?: string | null
  autor?: string | null
}

export const MensagensNotificacoes = () => {
  const GRUPO_ESTUDANTE_SIGLA = "EST"
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const currentTab =
    tabParam === 'comunicados' || tabParam === 'mensagens'
      ? tabParam
      : 'mensagens'

  const handleTabChange = (value: string) => {
    const nextSearchParams = new URLSearchParams(searchParams)

    if (value === 'mensagens') {
      nextSearchParams.delete('tab')
    } else {
      nextSearchParams.set('tab', value)
    }

    setSearchParams(nextSearchParams)
  }

  const authData = AuthStorage.get()
  const { profileData, error: profileError } = useQueryProfile()
  const userId = authData?.user_id ?? profileData?.userId ?? ''
  const pre_inscricao = profileData?.codigo_preinscricao ?? ''
  const { data: comunicados, isLoading: isLoadingComunicados } =
    useQueryAnnouncement({ pre_inscricao: Number(pre_inscricao) })
  // ← aqui lê o localStorage
  const { data: mensagens, isLoading: isLoadingMensagens } = useQueryMessage({
    userId: userId.toString(),
  })

  // AVISOS ESTUDANTES

  const curso = profileData?.codigo_curso
    ? Number(profileData.codigo_curso)
    : undefined

  const periodo = profileData?.periodoid
    ? Number(profileData.periodoid)
    : undefined

  const {
    data: avisosGrupo = [],
    isLoading: isLoadingAviso,
  } = useQueryAvisosPorGrupo({
    sigla: GRUPO_ESTUDANTE_SIGLA,
    curso,
    periodo,
    enabled: profileData?.estado_aluno === 'ALUNO_MATRICULADO'
  })

  const avisosValidos = useMemo(() => {
    const agora = new Date()

    return avisosGrupo.filter((aviso) => {
      const ativo = aviso.STATUS === 1

      const naoExpirado =
        !aviso.DATE_EXPIRACAO || new Date(aviso.DATE_EXPIRACAO) >= agora

      return ativo && naoExpirado
    })
  }, [avisosGrupo])


  const handleDownload = async (ficheiroName: string) => {
    if (!ficheiroName) return;

    try {
      const fileUrl = buildImageAssets(ficheiroName);
      if (!fileUrl) return;

      const response = await fetch(fileUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = ficheiroName;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar ficheiro:", error);
    }
  };
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

  const normalizedAvisos: Notification[] = avisosValidos.map((item) => ({
    id: String(item.CODIGO),
    type: 'aviso',
    title: item.ASSUNTO ?? 'Sem assunto',
    message: item.DESCRICAO ?? '',
    date: item.DATE_EXPIRACAO ?? new Date().toISOString(),
    read: false,
    priority: 'low',
    respostas: null,
    fileName: item.FILE_NAME ?? null,
    autor: item.AUTOR ?? null,
  }))

  const comunicadosEAvisos = [...normalizedComunicados, ...normalizedAvisos]

  const isLoading = isLoadingMensagens || isLoadingComunicados || isLoadingAviso

  const getPriorityColor = (priority: 'medium' | 'low') => {
    return priority === 'medium' ? 'default' : 'secondary'
  }

  const getIcon = (type: 'mensagem' | 'comunicado' | 'aviso') => {
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

      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mensagens">
            Mensagens ({normalizedMensagens.length})
          </TabsTrigger>
          <TabsTrigger value="comunicados">
            Comunicados ({normalizedAvisos.length})
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
                          {(msg.respostas.file_name1 || msg.respostas.file_name2 || msg.respostas.file_name3) && (
                            <div className="mt-3 text-xs">
                              <p className="font-medium text-muted-foreground mb-1">Anexos:</p>
                              <div className="flex flex-col gap-2">
                                {msg.respostas.file_name1 && (
                                  <div className="flex items-center justify-between bg-muted/50 p-2 rounded border">
                                    <span className="text-blue-600 truncate max-w-[220px]">
                                      {msg.respostas.file_name1}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDownload(msg.respostas?.file_name1!)}
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}

                                {msg.respostas.file_name2 && (
                                  <div className="flex items-center justify-between bg-muted/50 p-2 rounded border">
                                    <span className="text-blue-600 truncate max-w-[220px]">
                                      {msg.respostas.file_name2}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDownload(msg.respostas?.file_name2!)}
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}

                                {msg.respostas?.file_name3 && (
                                  <div className="flex items-center justify-between bg-muted/50 p-2 rounded border">
                                    <span className="text-blue-600 truncate max-w-[220px]">
                                      {msg.respostas?.file_name3}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDownload(msg.respostas?.file_name3!)}
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

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
          {comunicadosEAvisos.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nenhum comunicado ou aviso disponível.
            </p>
          ) : (
            comunicadosEAvisos
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime(),
              )
              .map((com) => (
                <Card key={`${com.type}-${com.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getIcon(com.type)}
                        <div>
                          <CardTitle className="text-base">{com.title}</CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {new Date(com.date).toLocaleDateString('pt-PT', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </CardDescription>

                          {com.autor && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Autor: {com.autor}
                            </p>
                          )}
                        </div>
                      </div>

                      <Badge variant={getPriorityColor(com.priority)}>
                        {com.type === 'aviso' ? 'Aviso' : 'Baixa'}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{com.message}</p>

                    {com.fileName && (
                      <div className="flex items-center justify-between bg-muted/50 p-2 rounded border">
                        <span className="text-blue-600 truncate max-w-[220px]">
                          {com.fileName}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(com.fileName!)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
