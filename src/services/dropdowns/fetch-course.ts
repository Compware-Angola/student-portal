import { apexApi } from "@/lib/apex-api";
import { gaApi } from "@/lib/ga-api";

export interface Curso {
  codigo: number;
  designacao: string;
  duracao: number;
}

export interface CursoParams {
  faculdadeId?: number;
  tipoCandidaturaId?: number;
  anoLectivo?: number;
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

export async function getCursosWithVagas(
  params?: CursoParams,
): Promise<Curso[]> {
  const response = await gaApi.get("cursos/com-vagas", {
    searchParams: {
      faculdadeId: params?.faculdadeId,
      tipoCandidaturaId: params?.tipoCandidaturaId,
      anoLectivo: params?.anoLectivo,
    },
  }).json<Curso[]>();

  return response ?? [];
}