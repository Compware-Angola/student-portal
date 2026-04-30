import { type TipoDocumento, fetchTipoDocumento } from "@/services/dropdowns/fetch-tipo-documento";
import { useQuery } from "@tanstack/react-query";


export function useQueryTipoDocumento() {
  return useQuery<TipoDocumento[], Error>({
    queryKey: ["tiposDocumento"],
    queryFn: fetchTipoDocumento,
    staleTime: 5 * 60 * 1000,
  });
}
