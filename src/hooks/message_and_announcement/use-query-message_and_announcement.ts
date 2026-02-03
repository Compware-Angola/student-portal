import {
  getAnnouncement,
  getMessage,
  type RespostaMensagens,
  type RespostaNotificacoes,
} from '@/services/message_and_announcement/message_and_announcement.service'
import { useQuery } from '@tanstack/react-query'

type Mensagem = {
  userId?: string
}

type Comunicado = {
  pre_inscricao?: string
}
export function useQueryMessage(params: Mensagem) {
  const { data, isLoading, error, isError } = useQuery<RespostaMensagens>({
    queryKey: ['student-messages', params.userId],
    queryFn: async () => {
      if (!params.userId) {
        throw new Error('Missing required parameters')
      }
      return getMessage(params.userId)
    },

    enabled: !!params.userId,
    retry: 0,
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

export function useQueryAnnouncement(params: Comunicado) {
  const { data, isLoading, error, isError } = useQuery<RespostaNotificacoes>({
    queryKey: ['student-announcements', params.pre_inscricao],
    queryFn: async () => {
      if (!params.pre_inscricao) {
        throw new Error('Missing required parameters')
      }
      return getAnnouncement(params.pre_inscricao)
    },
    enabled: !!params.pre_inscricao,
    retry: 0,
    staleTime: 5 * 60 * 1000,
  })

  // Retorna apenas o array de notificações
  return {
    data: data?.notificacao ?? [],
    isLoading,
    error,
    isError,
  }
}
