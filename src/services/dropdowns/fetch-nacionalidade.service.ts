import { gaApi } from "@/lib/ga-api";

export interface Nacionalidade {
  value: number;
  label: string;
}

export async function fetchNacionalidade(): Promise<Nacionalidade[]> {
  const data = await gaApi
    .get("dropdown-filters/nacionalidade")
    .json<Nacionalidade[]>();

  return data ?? [];
}