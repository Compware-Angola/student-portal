import { getAnnouncement, getMessage, type RespostaMensagens, type RespostaNotificacoes } from "@/services/message_and_announcement/message_and_announcement.service"
import { useQuery } from "@tanstack/react-query"


 type Mensagem = {
   userId:string 
 }

 type Comunicado={
  pre_inscricao:string
}
export function useQueryMessage(params:Mensagem) {
  const { data, isLoading, error, isError } = useQuery<RespostaMensagens>({
    queryKey: ['student-messages',params.userId],
    queryFn:  async () => {
          if (!params.userId ) {
            throw new Error('Missing required parameters')
          }
          return getMessage(params.userId)
        },
    // Garante que a query só é executada se o studentId for fornecido
    enabled: !!params.userId, 
    // Não tenta buscar novamente em caso de falha (padrão do modelo fornecido)
    retry: 0, 
    // Configurações comuns: staleTime baixo para dados que mudam com frequência (como mensagens/chat)
    staleTime: 60 * 1000, // 1 minuto
  })

  // Retorna apenas o array de mensagens
  return {
    data: data?.mensagens ?? [],
    isLoading,
    error,
    isError,
  }
}


export function useQueryAnnouncement(params:Comunicado) {
  const { data, isLoading, error, isError } = useQuery<RespostaNotificacoes>({
    queryKey: ['student-announcements',params.pre_inscricao],
    queryFn:  async () => {
          if (!params.pre_inscricao ) {
            throw new Error('Missing required parameters')
          }
          return getAnnouncement(params.pre_inscricao)
        },
    // Garante que a query só é executada se o userId for fornecido
    enabled: !!params.pre_inscricao,
    // Não tenta buscar novamente em caso de falha (padrão do modelo fornecido)
    retry: 0, 
    // Configurações: staleTime mais alto para comunicados que mudam menos
    staleTime: 5 * 60 * 1000, // 5 minutos
  })

  // Retorna apenas o array de notificações
  return {
    data: data?.notificacao ?? [],
    isLoading,
    error,
    isError,
  }
}