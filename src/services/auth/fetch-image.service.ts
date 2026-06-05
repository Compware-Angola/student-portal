import { gaApi } from '@/lib/ga-api'


type ResponseGetAvisos = {
  assunto: string;
  date_expiracao: string;
  descricao: string;
  sigla: string | null;
  file_name: string | null;
  created_at: string;
  updated_at: string;
  canal: string | null;
  tipo_aviso: string | null;
  status_: number;
  origem: string | null;
  id: number;
}

export async function getAvisosGeral(sigla?: string): Promise<ResponseGetAvisos[]> {
  const response = await gaApi.get<ResponseGetAvisos[]>(
    `solicitacoa/aviso/geral-student${sigla ? `?sigla=${sigla}` : ''}`
  )


  return response.json()
}