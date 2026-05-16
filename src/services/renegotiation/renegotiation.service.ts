import { invoiceApi } from '@/lib/invoice-api'

// --- 1. Sub-Estruturas ---

export interface Empresa {
  id: number
  designacao: string
  nome: string
  pessoal_Contacto: string
  telefone_empresa: string
  telefone_empresa2: string
  telefone_empresa3: string | null
  endereco: string
  pais_id: number
  statu_id: number
  nif: string
  tipo_cliente_id: number
  tipo_regime_id: string
  logotipo: string
  website: string
  email: string
  referencia: string
  created_at: string
  updated_at: string
  cidade: string
  file_alvara: string
  file_nif: string | null
}

export interface AnoCorrente {
  Codigo: number
  Designacao: string
  dataInicioPrimeiroSemestre: string
  dataFimPrimeiroSemestre: string
  dataInicioSegundoSemestre: string
  dataFimSegundoSemestre: string
  estado: string
  data_ultima_atualizacao: string
  status: number
  ordem: number
  epoca_exame_acesso: number
}

export interface Mes {
  id: number
  designacao: string
}

export interface MesDivida {
  codGradeCurricular: string
  codFacturaOutrosServicos: string
  valor: string // String no JSON
  multa: number
  total: number
  servico: string
  mes_propina: string
  mes_temp_id: number
  n_prestacao: number
  ano_lectivo: string
  taxa_multa: number
  taxa_desconto: number
  bolsa: string
  codigo_propina: number
  codigo_anoLectivo: number
  desconto: number
  incidencia: number
  valor_iva: number
  tipo_taxas: number
  taxa_descricao: string
}

// --- 2. Tipo Principal da Resposta (DebtNegotiationResponse) ---

/**
 * Representa a estrutura de dados completa retornada pelo endpoint /api/debt-negotiation.
 *
 * NOTA: Esta estrutura É DIFERENTE da sua interface DebtSearchResult original,
 * que precisa ser adaptada no seu componente se for usar este mock.
 */

export interface Mensalidade {
  mes_temp_id: number
  mes: string
  data_inicial: string
  data_final: string
  data_limite: string
  id_item: number
  codigo_matricula: number
  ano_lectivo_fatura: number
  estado_fatura: number
  valorapagar: number
  valorentregue: number
  data_vencimento: string
  desconto: number
  semestre: number
  multa: number
  total_item: number
  valor_pago: number
  mensalidade: number
  total: number
  total_preco: number
  status_pagamento: number
  data_operacao: string | null
  data_pagamento: string | null
  descricao_servico: string | null
  codigo_servico: number | null
}
export interface OutroServico {
  codgradecurricular: number
  codfacturaoutrosservicos: number
  valor: number
  multa: number
  total: number
  servico: string
  ano_lectivo: string
  taxa_multa: number
  taxa_desconto: number
  codidigo_servico: number
  codigo_anolectivo: number
  desconto: number
  incidencia: number
  valor_iva: number
  tipo_taxas: number
  taxa_descricao: string
}

export interface DebtNegotiationResponse {
  Mensalidades: Mensalidade[]
  OutrosServicos: OutroServico[]
  anoAtual: number
  totalIVA: number
  percentagem_retencao: number
  totalDivida: number
  total_incidencia: number
  total_retencao: number
  size: number
  desconto: number
  precoTotal: number
}

export interface DebitSearchParams {
  page?: number
  limit?: number
  enrollmentCode: number
  academicYear?: number
  preinscricao: number
  type: string
}

export async function getDebit(
  searchParams: DebitSearchParams,
): Promise<DebtNegotiationResponse> {
   const params = new URLSearchParams({
    codigo_matricula: String(searchParams.enrollmentCode),
  })
  if (searchParams.academicYear !== undefined) {
    params.append('codAnoLectivo', String(searchParams.academicYear))
  }
  const response = await invoiceApi
    .get(
      `debt-negotiation/get-debts-information?${params.toString()}`,
    )
    .json<DebtNegotiationResponse>()
  return response
}
interface FaturaItemMensalidade {
  codGradeCurricular: string
  codFacturaOutrosServicos: string
  bolsa: string
  mes_temp_id: number
  n_prestacao: number
  valor: string // no JSON vem como string, mesmo sendo número
  multa: number
  total: number
  servico: string
  mes_propina: string
  ano_lectivo: string
  taxa_multa: number
  taxa_desconto: number
  codigo_propina: number
  codigo_anoLectivo: number
  desconto: number
  incidencia: number
  valor_iva: number
  tipo_taxas: number
  taxa_descricao: string
}

interface FaturaItemServico {
  codGradeCurricular: number
  codFacturaOutrosServicos: number
  codigo_propina: string
  codidigo_servico: string // mantive o nome exato do JSON (typo original)
  codigo_anoLectivo: string
  valor: number
  multa: number
  total: number
  taxa_multa: number
  taxa_desconto: number
  desconto: number
  incidencia: number
  valor_iva: number
  servico: string
  mes_propina: string
  n_prestacao: string
  ano_lectivo: string
  bolsa: string
  taxa_descricao: string
  mes_temp_id: number
}

export interface RenegociacaoPayload {
  totalDivida: number
  precoTotal: number
  total_retencao: number
  total_incidencia: number
  totalIVA: number
  desconto: number
  percentagem_retencao: number
  tipoPagamento: string

  Mensalidades: {
    mes_temp_id: number
    mes: string
    valor: string
    multa: number
    total: number
    servico: string
    codigo_servico: number | null
    ano_lectivo: number
    desconto: number
    incidencia: number
    valor_iva: number
    tipo_taxas: number
    codigo_factura: number
    obs: string
  }[]

  OutrosServicos: {
    codgradecurricular: number
    codfacturaoutrosservicos: number
    codidigo_servico: string
    ano_lectivo: number
    valor: number
    multa: number
    total: number
    taxa_multa: number
    taxa_desconto: number
    desconto: number
    incidencia: number
    valor_iva: number
    obs: string
    servico: string
  }[]
}

export async function createDebitNegotation(
  enrollmentCode: number,
  payload: RenegociacaoPayload,
): Promise<void> {
  return invoiceApi
    .post(`debt-negotiation/${enrollmentCode}`, {
      json: payload,
    })
    .json()
}
