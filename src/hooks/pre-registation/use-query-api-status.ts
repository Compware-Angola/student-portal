import { type ApiStatusResponse, fetchApiStatus } from "@/services/pre-inscrition/fetch-api-status.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryApiStatus(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true

  return useQuery<ApiStatusResponse>({
    queryKey: ["api-status"],
    queryFn: fetchApiStatus,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1,
    enabled,
  });
}