
import { fetchFaculdadesService, type Faculdade } from "@/services/faculdade/fetch-faculdade.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryFetchFaculdades() {
  return useQuery<Faculdade[], Error>({
    queryKey: ["faculdades"],
    queryFn: fetchFaculdadesService,
    staleTime: 1000 * 60 * 5,
  });
}
