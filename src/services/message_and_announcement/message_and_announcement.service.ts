import { apexApi } from '@/lib/apex-api'
 export interface DetalheResposta {

  mensagem_resposta?: string;
  data_resposta?: string;
  file_name1?: string | 'None';
  file_name2?: string | 'None';
  file_name3?: string | 'None';
  nome_usuario_resposta?: string;
}
interface ItemMensagem {
  estudante: string;

  mensagem?: string;
  assunto?: string;
  descricao_tipo_suporte?: string;

  utilizador: string;

  data_mensagem: string;
  status_mensagem: 'aguarda resposta' | 'respondido';
  contactos_id: string;
  resposta: DetalheResposta;
}

// 3. Tipagem para a estrutura da resposta completa da API
export interface RespostaMensagens {
  mensagens: ItemMensagem[];
}
interface ItemNotificacao {
  matricula: string;
  destinatario: string;
  assunto: string;
  remetente: string;
  data_notificacao: string;
  notificacao_id: string;
  descricao: string;
}


 export interface RespostaNotificacoes {
  notificacao: ItemNotificacao[];
}

export async function getMessage(UserId:string): Promise<RespostaMensagens> {
  return apexApi.get(`message/students/${UserId}`).json<RespostaMensagens>()
}

export async function getAnnouncement(pre_inscricao:number): Promise<RespostaNotificacoes> {
  return apexApi.get(`message/notifications/${pre_inscricao}`).json<RespostaNotificacoes>()
}
