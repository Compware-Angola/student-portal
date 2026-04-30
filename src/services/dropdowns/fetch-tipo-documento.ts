import { gaApi } from "@/lib/ga-api";

export type TipoDocumento = {
  codigo: number;
  designacao: string;
};


export async function fetchTipoDocumento(): Promise<TipoDocumento[]> {
  const data = await gaApi
    .get("referencias/tipo-documentos")
    .json<TipoDocumento[]>();

  return data ?? [];
}
