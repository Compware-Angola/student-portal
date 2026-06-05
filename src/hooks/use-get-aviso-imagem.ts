import { getAvisosGeral } from "@/services/auth/fetch-image.service"
import { useQuery } from "@tanstack/react-query"

export function useGetAvisosGeral(sigla?: string) {
  return useQuery({
    queryKey: ["avisos-geral", sigla],
    queryFn: () => getAvisosGeral(sigla),
  })
}