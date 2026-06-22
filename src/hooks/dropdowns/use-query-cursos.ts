import { type CursoParams, type Curso, getCursosDropdown } from "@/services/dropdowns/fetch-course";
import { useQuery } from "@tanstack/react-query";

export function useCursos(params?: CursoParams, enabled=true) {
  return useQuery<Curso[], Error>({
    queryKey: ["cursos", params?.faculdadeId, params?.tipoCandidaturaId],
    queryFn: () => getCursosDropdown(params),
    enabled,
    staleTime: 1000 * 60 * 60,
  });
}
