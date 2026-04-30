import { apexApi } from "@/lib/apex-api";
export type Periodo = {
  codigo: number;
  designacao: string;
};
type PeriodoResponse = {
  periodos: Periodo[];
};

export async function fetchPeriodo(): Promise<Periodo[]> {
  const response = await apexApi
    .get("uma/period/all")
    .json<PeriodoResponse>();

  return response.periodos ?? [];
}
