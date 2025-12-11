import { apexApi } from '@/lib/apex-api'

export type SupportPayload = {
  descricao: string
  assunto: string
  tipo_suporte: number
  file_name1: string | null
}

export type RespostaMensagens = {
  success: boolean
  message: string
  data?: any
}

export async function createSupport(
  UserId: string,
  payload: SupportPayload,
): Promise<RespostaMensagens> {
  try {
    const response = await apexApi
      .post(`message/students/${UserId}`, {
        json: payload,
      })
      .json<{
        codresposta: number
        msgresposta: string
        id_contacto: number
      }>()

    return {
      success: response.codresposta === 200,
      message: response.msgresposta,
      data: {
        id_contacto: response.id_contacto,
      },
    }
  } catch (error: any) {
    console.error('Erro ao criar suporte:', error)
    return {
      success: false,
      message: error?.message || 'Ocorreu um erro ao enviar o suporte.',
    }
  }
}

export type TipoSuporte = {
  codigo: string
  designacao: string
}

export type TipoSuporteResponse = {
  tipo_suporte: TipoSuporte[]
}

export async function getAllSupportTypes(): Promise<TipoSuporte[]> {
  try {
    const response = await apexApi
      .get('uma/suport/type/all')
      .json<TipoSuporteResponse>()

    return response.tipo_suporte
  } catch (error: any) {
    console.error('Erro ao buscar tipos de suporte:', error)
    return []
  }
}
