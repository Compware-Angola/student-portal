import { gaApi } from "@/lib/ga-api"
export type CaderiraRecuro = {
 codigoGradeAluno: number
        gradeCurricula: number
        disciplina: string
        unidadeCurricular: string
        semestre: string
        duracao: string
        ano: string
        media: string
        resultado: string
        formula: string[]
        obs: string[]
}
type GetCadeirasRecurosResponse = {
    total: number
    matricula: number
    anoLectivo: number
    nomeCompleto: string
    cadeiras: CaderiraRecuro[]
}
type GetCadeirasRecurosParams = {
    anoLetivo: number
    matricula: number
    semestre: number
}
export function getCadeirasRecuros({
    anoLetivo,
    matricula
}: GetCadeirasRecurosParams) {
    const endpoint = `students/provas/recurso/${anoLetivo}/${matricula}`
    return gaApi.get(endpoint).json<GetCadeirasRecurosResponse>()
}