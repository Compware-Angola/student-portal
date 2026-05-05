import { apexApi } from "@/lib/apex-api";

export type Sex = {
  codigo: number;
  designacao: string;
};

type SexResponse = {
  sexos: Sex[];
};

export async function fetchSex(): Promise<Sex[]> {
  const response = await apexApi
    .get("uma/sex/all")
    .json<SexResponse>();

  return response.sexos ?? [];
}
