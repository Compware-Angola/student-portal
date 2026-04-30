import { fetchPoloDropdown, type DataResponse } from "@/services/dropdowns/fecth-polo.service";
import { useQuery } from "@tanstack/react-query";

export function usePoloDropdown() {
  return useQuery<DataResponse[]>({
    queryKey: ["polo-dropdown"],
    queryFn: fetchPoloDropdown,
    staleTime: 1000 * 60 * 10,
    retry: 0,
  });
}