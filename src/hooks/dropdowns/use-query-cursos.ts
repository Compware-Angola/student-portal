import { type CursoParams, type Curso, getCursosWithVagas } from "@/services/dropdowns/fetch-course";
import { useQuery } from "@tanstack/react-query";

export function useCursos(params?: CursoParams, enabled=true) {
  return useQuery<Curso[], Error>({
    queryKey: ["cursos", params?.faculdadeId, params?.tipoCandidaturaId, params?.anoLectivo],
    queryFn: () => getCursosWithVagas(params),
    enabled,
    staleTime: 1000 * 60 * 60,
  });
}
