import { invoiceApi } from '@/lib/invoice-api'

export type TypeServiceResponse = {
  codigo: number
  sigla: string
  descricao: string
  preco: number
  tiposervico: string
  codigo_ano_lectivo: number
  estado: string
  data: string
  datacriacao: string
  disponibilizar_aluno: string | null
  visualizar_no_portal: string
  polo_id: number
  canal: number
  mestrado: string
  codigo_grade_currilular: number | null
  tipo_candidatura: number
}

export type GetTypeServiceParams = {
  sigla?: string
  descricao?: string
  codigoAnoLectivo?: number
  estado?: string
}

export async function getTypeService(params?: GetTypeServiceParams) {
  const data = await invoiceApi
    .get<TypeServiceResponse[]>('type-service', {
      searchParams: params,
    })
    .json()

  return data
}
