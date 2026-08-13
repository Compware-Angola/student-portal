import { getMesTemp } from "@/services/finance/mes-temp.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryMesTemp(codigoAnoLectivo: number, prestacao: number) {
    return useQuery({
        queryKey: ['mes-temp', codigoAnoLectivo, prestacao],
        queryFn: () => getMesTemp(codigoAnoLectivo, prestacao),
        enabled: Boolean(codigoAnoLectivo),
    });
}