import { type Periodo, fetchPeriodo } from "@/services/dropdowns/fetch-period";
import { useQuery } from "@tanstack/react-query";

export function useQueryPeriod() {
  return useQuery<Periodo[]>({
    queryKey: ["period"],
    queryFn: fetchPeriodo,
    staleTime: 1 * 60 * 60 * 1000,
  });
}
