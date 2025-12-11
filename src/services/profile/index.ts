import { apexApi } from '@/lib/apex-api'

export async function getProfile(id: string): Promise<StudentProfile> {
  return await apexApi.get(`students/profile/${id}`).json<StudentProfile>()
}

export interface StudentProfile {
  codresposta: number
  msgresposta: string
  codigo_preinscricao: string
  nome_completo: string
  sexo: string
  data_nascimento: string
  email: string
  bilhete_identidade: string
  telefone: string
  numero_documento: string
  codigo_admissao: string
  data_admissao: string
  codigo_matricula: string
  data_matricula: string
  estado_matricula: string
  codigo_curso: string
  codigo_aluno: string
  curso: string
  periodo: string
  periodoId: string
  max_cadeiras_curso: string
  curso_candidatura: string
  polo: string
  confirmacoes: Confirmac[]
  saldo_actual: string
  saldo_anterior: string
  userId: string
  poloId: string
  codigo_tipo_candidatura: string
  curso_candidatura_designacao: string
  foto: string
}

export interface Confirmac {
  codigo: string
  codigo_matricula: string
  ano_lectivo: string
  estado: string
  classe: string
  cadeirante: string
  canal: string
}
