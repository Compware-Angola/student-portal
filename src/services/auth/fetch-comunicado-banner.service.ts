import { gaApi } from "@/lib/ga-api";

export type ComunicadoBannerResponse = {
  sigla: "COMUNICADO_PORTAL";
  filename: string | null;
  updatedAt: string | null;
};

export async function getComunicadoBanner(): Promise<ComunicadoBannerResponse> {
  const response = await gaApi.get<ComunicadoBannerResponse>(
    "solicitacoa/aviso/imagem/COMUNICADO_PORTAL",
  );

  return response.json();
}
