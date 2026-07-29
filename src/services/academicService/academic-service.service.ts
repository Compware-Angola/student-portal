import { invoiceApi } from '@/lib/invoice-api'

export type ServiceItem = {
  codigo: number
  sigla: string
  descricao: string
  preco: number
  tiposervico: string
  codigo_ano_lectivo: number
  estado: string
  data: string
  datacriacao: string
  disponibilizar_aluno: 'SIM' | 'NAO' | null
  visualizar_no_portal: 'SIM' | 'NAO' | string
  polo_id: number
  taxa_iva_id: number
  motivo_isencao_iva_codigo: number
  canal: number
  mestrado: 'SIM' | 'NAO' | string
  codigo_grade_currilular: number | null
  tipo_candidatura: number
  polo: string
  ano_lectivo: string
}

// Interface para a resposta paginada da API
export type AvailableServicesResponse = {
  data: ServiceItem[]
  total: number
  page: number
  limit: number
  lastPage: number
}

export type GetAcademicServiceParams = {
  descricao?: string
  codigoAnoLectivo?: string | number
  estado?: string
  visualizarNoPortal?: 'SIM' | 'NAO' | string
  tipoCandidatura?: string | number
  page?: number
  limit?: number
}

/**
 * Função para buscar os serviços académicos disponíveis, com suporte a filtros e paginação.
 *
 * @param {GetAcademicServiceParams} params
 * @returns {Promise<AvailableServicesResponse>}
 */
export async function getAcademicService(
  params: GetAcademicServiceParams,
): Promise<AvailableServicesResponse> {
  const searchParams = new URLSearchParams()

  if (params.descricao) searchParams.set('descricao', params.descricao)
  if (params.codigoAnoLectivo !== undefined)
    searchParams.set('codigoAnoLectivo', String(params.codigoAnoLectivo))
  if (params.estado) searchParams.set('estado', params.estado)
  if (params.visualizarNoPortal)
    searchParams.set('visualizarNoPortal', params.visualizarNoPortal)
  if (params.tipoCandidatura !== undefined)
    searchParams.set('tipoCandidatura', String(params.tipoCandidatura))
  searchParams.set('page', String(params.page ?? 1))
  searchParams.set('limit', String(params.limit ?? 10))

  return invoiceApi
    .get(`type-service/all?${searchParams.toString()}`)
    .json<AvailableServicesResponse>()
}