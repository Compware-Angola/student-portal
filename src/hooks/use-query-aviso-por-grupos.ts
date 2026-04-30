import {
  AvisosPorGrupoService,
  type AvisosPorGrupoResponse,
} from "@/services/auth/fetch-aviso-por-grupos";
import { useQuery } from "@tanstack/react-query";

type UseQueryAvisosPorGrupoProps = {
  sigla?: string;
  curso?: number;
  periodo?: number;
};

export function useQueryAvisosPorGrupo({
  sigla,
  curso,
  periodo,
  enabled = true,
}: UseQueryAvisosPorGrupoProps & { enabled?: boolean }) {
  const siglaValida = !!sigla?.trim();

  return useQuery<AvisosPorGrupoResponse>({
    queryKey: ["avisos-por-grupo", sigla?.trim(), curso, periodo],
    queryFn: () =>
      AvisosPorGrupoService({
        sigla: sigla?.trim(),
        curso,
        periodo,
      }),
    enabled: siglaValida && enabled,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
    refetchOnWindowFocus: true,
    retry: 2,
  });
}