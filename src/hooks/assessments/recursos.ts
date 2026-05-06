import { useQuery } from "@tanstack/react-query"
import { getCadeirasRecuros } from "@/services/assessments/recursos.service"
type Props = {
    anoLetivo?: number
    matricula?: number
    semestre?: number
}
export function useQueryCadeirasRecuros({anoLetivo, matricula}: Props) {

    return useQuery({
        queryKey: ['cadeiras-recursos', anoLetivo, matricula],
        queryFn: () => getCadeirasRecuros({anoLetivo: anoLetivo!,matricula: matricula!, semestre: 1}),
        enabled: !!anoLetivo && !!matricula
    })
}

