import { gaApi } from "@/lib/ga-api";

export type PortalStudentImageResponse = {
  sigla: "PORTAL_ESTUDANTE";
  filename: string | null;
  updatedAt: string | null;
};

export async function getPortalStudentImage(): Promise<PortalStudentImageResponse> {
  const response = await gaApi.get<PortalStudentImageResponse>(
    "solicitacoa/aviso/imagem/PORTAL_ESTUDANTE",
  );

  return response.json();
}
