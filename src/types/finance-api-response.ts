export type Mensalidade = {
  mes_temp_id: number;
  mes: string;
  data_inicial: string;
  data_final: string;
  data_limite: string;
  data_final_desconto: string | null;
  id_item: number;
  id_tipo_servico: number;
  descricao_servico: string;
  tipo_servico: string;
  codigo_matricula: string | null;
  ano_lectivo_fatura: string | null;
  estado_fatura: string | null;
  total_item: number;
  valor_pago: number;
  reference: string | null;
  data_vencimento: string | null;
  status_pagamento: number | string; // pode vir "1"
  codigo_factura: number | null;
};


export type MonthlyFeeDataResponse = {
  data: Mensalidade[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
