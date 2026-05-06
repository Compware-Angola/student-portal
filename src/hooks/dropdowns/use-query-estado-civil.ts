import { useQuery } from "@tanstack/react-query";
import {
  fetchEstadoCivil,
  type EstadoCivil,
} from "@/services/dropdowns/fetch-estado-civil.service";

export function useQueryEstadoCivil() {
  return useQuery<EstadoCivil[]>({
    queryKey: ["estado-civil-dropdown"],
    queryFn: fetchEstadoCivil,
    staleTime: 1000 * 60 * 10, // 10 min
    retry: 0,
  });
}