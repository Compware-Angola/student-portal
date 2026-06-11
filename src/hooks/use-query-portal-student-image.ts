import { useQuery } from "@tanstack/react-query";
import { getPortalStudentImage } from "@/services/auth/fetch-portal-student-image.service";

export function useQueryPortalStudentImage() {
  return useQuery({
    queryKey: ["aviso-imagem", "PORTAL_ESTUDANTE"],
    queryFn: getPortalStudentImage,
    retry: false,
  });
}
