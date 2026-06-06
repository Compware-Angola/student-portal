import { useQuery } from "@tanstack/react-query";
import { getComunicadoBanner } from "@/services/auth/fetch-comunicado-banner.service";

export function useQueryComunicadoBanner() {
  return useQuery({
    queryKey: ["aviso-imagem", "COMUNICADO_PORTAL"],
    queryFn: getComunicadoBanner,
    retry: false,
  });
}
