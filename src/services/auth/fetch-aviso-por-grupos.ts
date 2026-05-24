import { gaApi } from "@/lib/ga-api";

/* ---------- RESPONSE ITEM ---------- */
export type AvisoPorGrupo = {
  CODIGO: number;
  ASSUNTO: string;
  DESCRICAO: string;
  STATUS: number;
  FILE_NAME?: string | null;
  DATE_EXPIRACAO: string | null;
  DESTINO: number;
  CURSO: number | null;
  PERIODO: number | null;
  AUTOR: string | null;
  CURSO_NOME: string | null;
  DESTINO_NOME: string | null;
};

type Params = {
  sigla?: string;
  curso?: number;
  periodo?: number;
};

/* ---------- RESPONSE COMPLETO ---------- */
export type AvisosPorGrupoResponse = AvisoPorGrupo[];

/* ---------- SERVICE ---------- */
export async function AvisosPorGrupoService(
  params: Params
): Promise<AvisosPorGrupoResponse> {
  const searchParams = new URLSearchParams();

  const sigla = params.sigla?.trim();

  if (sigla) {
    searchParams.append("sigla", sigla);
  }

  if (params.curso !== undefined && params.curso !== 0) {
    searchParams.append("curso", String(params.curso));
  }

  if (params.periodo !== undefined && params.periodo !== 0) {
    searchParams.append("periodo", String(params.periodo));
  }

  const queryString = searchParams.toString();
  const url = queryString
    ? `solicitacoa/avisos-por-grupo?${queryString}`
    : `solicitacoa/avisos-por-grupo`;

  const response = await gaApi.get<AvisosPorGrupoResponse>(url);
  const data = await response.json()
  return data;
}