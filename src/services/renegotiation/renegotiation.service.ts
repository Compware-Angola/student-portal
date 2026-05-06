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
export interface DebtNegotiationResponse {
  empresa: Empresa
  anoAtual: number
  anoCorrente: AnoCorrente
  meses: Mes[]
  mesesDividas: MesDivida[]
  totalIVA: number
  percentagem_retencao: number
  totalDivida: number
  total_incidencia: number
  total_retencao: number
  size: number
  desconto: number
  precoTotal: number
  bolsa: string | null
  saldo_reset: number
  somaValorDividaRecurso: number
  dividaOutrosServicos: any[]
  somaDividaFacturas: number
}

export interface DebitSearchParams {
  page?: number
  limit?: number
  enrollmentCode: number
  preinscricao: number
  type: string
}

export async function getDebit(
  searchParams: DebitSearchParams,
): Promise<DebtNegotiationResponse> {
  const response = await invoiceApi
    .get(
      `debt-negotiation?matricula=${searchParams.enrollmentCode}&preinscricaoId=${searchParams.preinscricao}&tipoCandidatura=${searchParams.type}`,
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
  desconto: number
  precoTotal: number
  total_retencao: number
  total_incidencia: number
  totalIVA: number
  saldo_reset: number
  tipoPagamento: 'TOTAL' | string
  fatura_item_mensalidades: FaturaItemMensalidade[]
  fatura_item_servicos: FaturaItemServico[]
  valor_pago_na_hora: number
  percentagem_retencao: number
  size: number
  bolsa: string
  somaValorDividaRecurso: number
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
