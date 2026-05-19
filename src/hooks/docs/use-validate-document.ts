// src/hooks/queries/use-validate-document.ts
import { validateDocument, type ValidateDocumentResponse } from "@/services/docs/validate-document.service";
import { useQuery } from "@tanstack/react-query";


/* =============================================
   Validar documento por código (GET)
   ============================================= */
export const useValidateDocument = (code: string) => {
  return useQuery<ValidateDocumentResponse, Error>({
    queryKey: ["validate-document", code],
    queryFn: () => validateDocument(code),

    enabled: !!code,


  });
};