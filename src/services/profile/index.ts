// essse servico se refer a api nova do apex
//
import { apexApi } from '@/lib/apex'

export type StudentProfile = {
  codresposta: number
  msgresposta: string
  codigo_preinscricao: string
  nome_completo: string
  sexo: string
  data_nascimento: string
  email: string
  bilhete_identidade: string
  contactos: string
  codigo_admissao: string
  data_admissao: string
  codigo_matricula: string
  data_matricula: string
  estado_matricula: string
  codigo_curso: string
  codigo_aluno: string
  curso: string
  polo: string
}

export async function getProfile(id: string): Promise<StudentProfile> {
  return await apexApi.get(`students/profile/${id}`).json<StudentProfile>()
}
