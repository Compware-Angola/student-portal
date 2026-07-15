// --- 1. Sub-Estruturas ---

export interface Utilizador {
  user_id: number
  nome: string
  email: string
  telefone: string
  numero_documento: string | null
  foto: string | null
  data_actualizacao: string
}

export interface DadosPessoais {
  nome_completo: string
  sexo: string
  data_nascimento: string
  estado_civil: string
  naturalidade: string | null
  provincia_origem: string | null
  codigo_nacionalidade: number
  contactos_telefonicos: string
  contacto_de_emergencia: string | null
  nome_pessoa_contacto: string
  morada_completa: string
  email: string
  deslocado_permanente: boolean
  necessidade_especial_id: number
  necessidade_especial: string
}

export interface Documento {
  tipo_identificacao: number
  bilhete_identidade: string
  numero_documento: string | null
  nif: string | null
  local_emissao_bi: number
  data_emissao_bi: string
  data_validade_bi: string
}

export interface FormacaoAnterior {
  instituicao_formacao: string
  instituicao_formacao_acesso: string | null
  data_conclusao: string
  media_final: number
  numero_ordem_medicos: string | null
  curso_ensino_medio: string
  codigo_habilitacao_anterior: number
  codigo_tipo_estabelecimento_secundario: number
  codigo_pais_habilitacao_anterior: number
}

export interface DadosProfissionais {
  instituicao_exerce_funcao: string | null
  data_inicio_trabalho: string
  provincia_trabalho: string | null
}

export interface Familia {
  pai: string
  mae: string
  ocupacao_pai: number
  ocupacao_mae: number
  ocupacao_conjuge: number
  profissao_pai: number
  profissao_mae: number
  profissao_conjuge: number
  grau_academico_pai: number
  grau_academico_mae: number
  grau_academico_conjuge: number
}

export interface Candidatura {
  codigo_preinscricao: number
  data_candidatura: string
  data_ultima_atualizacao: string
  estado: string
  estado_candidato: string
  permitir_inscricao: boolean
  canal: number
  codigo_tipo_candidatura: number
  codigo_forma_ingresso: number
  ano_lectivo: string
  ano_lectivo_codigo: number
  polo_id: number
  polo: string
}

export interface OpcaoCurso {
  opcao: number
  codigo: number
  designacao: string
  duracao?: number
  turno_codigo?: number
  turno?: string
}

export interface Financeiro {
  saldo: number
  saldo_anterior: number
  saldo_reset: number
  saldo_reset_anterior: number
  desconto: number
  obs_saldo: string | null
  obs_desconto: string | null
  isencao_multa: string | null
}

export interface Validacao {
  codigo_validacao_email: string | null
  estado_atualizacao_email: number
}

// --- 2. Tipo Principal da Resposta ---

/**
 * Representa a estrutura de dados completa retornada pelo endpoint
 * /api/pre-inscricoes/ficha/:userId
 */
export interface PreInscricaoFichaResponse {
  utilizador: Utilizador
  dados_pessoais: DadosPessoais
  documento: Documento
  formacao_anterior: FormacaoAnterior
  dados_profissionais: DadosProfissionais
  familia: Familia
  candidatura: Candidatura
  opcoes_curso: OpcaoCurso[]
  financeiro: Financeiro
  validacao: Validacao
  created_at: string | null
  updated_at: string
}

// --- 3. Params ---

export interface PreInscricaoFichaParams {
  userId: number | string
}
