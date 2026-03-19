import {
  AvisosPorGrupoService,
  type AvisosPorGrupoResponse,
} from "@/services/auth/fetch-aviso-por-grupos";
import { useQuery } from "@tanstack/react-query";

type UseQueryAvisosPorGrupoProps = {
  grupoId?: number;
  curso?: number;
  periodo?: number;
};

export function useQueryAvisosPorGrupo({
  grupoId,
  curso,
  periodo,
}: UseQueryAvisosPorGrupoProps) {
  return useQuery<AvisosPorGrupoResponse>({
    queryKey: ["avisos-por-grupo", grupoId, curso, periodo],
    queryFn: () =>
      AvisosPorGrupoService({
        grupoId,
        curso,
        periodo,
      }),
    enabled:
      (grupoId !== undefined && grupoId !== 0) ||
      (curso !== undefined && curso !== 0) ||
      (periodo !== undefined && periodo !== 0),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}