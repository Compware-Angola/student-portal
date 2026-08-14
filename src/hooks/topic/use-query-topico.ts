import { useQuery } from "@tanstack/react-query";
import { getTopicoByAnoLetivo } from "@/services/topic/topic-service.service";

export function useQueryTopicoByAnoLetivo(
  anoLetivoId?: number,
) {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["topico", anoLetivoId],
    queryFn: () => getTopicoByAnoLetivo(anoLetivoId!),
    enabled: !!anoLetivoId,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });

  return {
    data,
    isLoading,
    error,
    isError,
  };
}