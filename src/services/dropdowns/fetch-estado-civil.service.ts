import { gaApi } from "@/lib/ga-api";

export interface EstadoCivil {
  codigo: number;
  designacao: string;
}

export async function fetchEstadoCivil(): Promise<EstadoCivil[]> {
  const data = await gaApi
    .get("referencias/estado-civil")
    .json<EstadoCivil[]>();

  return data ?? [];
}