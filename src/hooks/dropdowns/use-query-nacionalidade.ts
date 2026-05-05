import { useQuery } from "@tanstack/react-query";
import {
  fetchNacionalidade,
  type Nacionalidade,
} from "@/services/dropdowns/fetch-nacionalidade.service";

export function useQueryNacionalidade() {
  return useQuery<Nacionalidade[]>({
    queryKey: ["nacionalidade-dropdown"],
    queryFn: fetchNacionalidade,
    staleTime: 1000 * 60 * 10, // 10 min
    retry: 0,
  });
}