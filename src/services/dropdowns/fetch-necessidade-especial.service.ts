import { gaApi } from "@/lib/ga-api";

export interface NecessidadeEspecial {
  value: number;
  label: string;
}

export async function fetchNecessidadesEspeciais(): Promise<NecessidadeEspecial[]> {
  const data = await gaApi
    .get("dropdown-filters/necessidades-especiais")
    .json<NecessidadeEspecial[]>();

  return data ?? [];
}