
export type Mensalidade = {
  mes_temp_id: string
  mes: string
  data_inicial: string
  data_final: string
  data_limite: string
  data_final_desconto: string | 'None' 
  id_item: string
  id_tipo_servico: string
  descricao_servico: string
  tipo_servico: string
  codigo_matricula: string
  ano_lectivo_fatura: string
  estado_fatura: string
  total_item: string 
  valor_pago: string 
  reference: string | null
  data_vencimento: string
  status_pagamento: number 
  codigo_factura: number
}


export type MonthlyFeeDataResponse = {
  mensalidades: Mensalidade[]
 
}