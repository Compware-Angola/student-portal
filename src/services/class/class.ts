import { apexApi } from '@/lib/apex-api'
type ClassProps = {
  codigo: string
  designacao: string
}

export type ClassResponse = {
  classes: ClassProps[]
}

export async function getClass(): Promise<ClassResponse> {
  return apexApi.get('uma/classe/all').json<ClassResponse>()
}
