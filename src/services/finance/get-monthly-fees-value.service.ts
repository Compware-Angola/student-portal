import { apexApi } from '@/lib/apex-api'

export type MonthlyFee = {
  codigo: string
  descricao: string
  preco: string
  tipo_servico: string
  estado: string
  disponibilizar_aluno: 'SIM' | 'NAO'
  visualizar_no_portal: 'SIM' | 'NAO'
  codigo_ano_lectivo: string
}

export type MonthlyFeeResponse = {
  servicos: MonthlyFee[]
}

type MonthlyFeeParams = {
  anoLetivo: number
  curso: number
  polo: number
}

/**
 * Serviço para buscar o valor das propinas mensais
 * por ano letivo, curso e polo.
 */
export async function getMonthlyFeesValue(
  params: MonthlyFeeParams,
): Promise<MonthlyFeeResponse> {
  const endpoint = `financial/monthly-fees-value/${params.anoLetivo}/${params.curso}/${params.polo}`
  return apexApi.get(endpoint).json<MonthlyFeeResponse>()
}