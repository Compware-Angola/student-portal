import { apexApi } from "@/lib/apex-api";

export type Faculdade = {
  codigo: number;
  designacao: string;
};

type FetchFaculdadesResponse = {
  faculdades: Faculdade[];
};

export async function fetchFaculdadesService(): Promise<Faculdade[]> {
   const data = await apexApi
    .get("uma/faculdade/all")
    .json<FetchFaculdadesResponse>();

  return data.faculdades;
}