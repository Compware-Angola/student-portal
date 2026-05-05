import { fetchSex, type Sex } from "@/services/dropdowns/fetch-sex.service";
import { useQuery } from "@tanstack/react-query";

export function useQuerySex() {
  return useQuery<Sex[]>({
    queryKey: ["sexos"],
    queryFn: fetchSex,
    staleTime: 1 * 60 * 60 * 1000, // 1 hora
  });
}