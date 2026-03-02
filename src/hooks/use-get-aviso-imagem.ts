import { getAvisoImagem } from "@/services/auth/fetch-image.service"
import { useQuery } from "@tanstack/react-query"

export function useGetAvisoImagem() {
  return useQuery({
    queryKey: ["aviso-imagem"],
    queryFn: getAvisoImagem,
  })
}