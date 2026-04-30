import { apexApi } from "@/lib/apex-api";

export interface Curso {
  codigo: number;
  designacao: string;
  duracao: number;
}

export interface CursoParams {
  faculdadeId?: number;
  tipoCandidaturaId?: number;
}

export interface CursoResponse {
  cursos: Curso[];
}

export async function getCursosDropdown(
  params?: CursoParams,
): Promise<Curso[]> {
  const response = await apexApi.get("uma/course/all", {
    searchParams: {
      faculdadeId: params?.faculdadeId,
      tipoCandidaturaId: params?.tipoCandidaturaId,
    },
  }).json<CursoResponse>();

  return response.cursos ?? [];
}