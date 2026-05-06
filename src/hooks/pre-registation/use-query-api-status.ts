import { type ApiStatusResponse, fetchApiStatus } from "@/services/pre-inscrition/fetch-api-status.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryApiStatus() {
  return useQuery<ApiStatusResponse>({
    queryKey: ["api-status"],
    queryFn: fetchApiStatus,
    staleTime: 1000 * 30,
    retry: 0,
    refetchInterval: 1000 * 30,
  });
}