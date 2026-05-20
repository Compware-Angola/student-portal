export type Mensalidade = {
  mes_temp_id: number
  mes: string
  data_inicial: string
  data_final: string
  data_limite: string
  id_item: number
  codigo_matricula: number
  ano_lectivo_fatura: number
  estado_fatura: number
  ValorAPagar: number
  valorEntregue: number
  data_vencimento: string
  desconto: number
  codigo_factura: any
  semestre: number
  multa: number
  total_item: number
  valor_pago: number
  mensalidade: number
  codigo_servico: number
  descricao_servico: string
  total: number
  total_preco: number
  status_pagamento: number
  data_operacao: string | null
  data_pagamento: string | null
  reference?: number | null
  
};


export type MonthlyFeeDataResponse = {
  data: Mensalidade[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
