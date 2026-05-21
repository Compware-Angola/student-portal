import { apexApi } from "@/lib/apex-api";

export type TipoCandidatura = {
  codigo: number;
  designacao: string;
};

type FetchTipoCandidaturaResponse = {
  tipo_candidaturas: TipoCandidatura[];
};

export async function fetchTipoCandidatura(): Promise<TipoCandidatura[]> {
  const data = await apexApi
    .get("uma/tipo-candidatura/all")
    .json<FetchTipoCandidaturaResponse>();

  return data.tipo_candidaturas ?? [];
}
