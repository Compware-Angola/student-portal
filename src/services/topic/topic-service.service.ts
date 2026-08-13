import { gaApi } from '@/lib/ga-api'

// ---------- Types ----------

export type Topico = {
    id: number
    designacao: string
    ano_lectivo_id: number
    ano_letivo: string
    arquivo: string | null
}

// ---------- Topicos ----------

export async function getTopicoByAnoLetivo(
    anoLetivoId: number,
): Promise<Topico | null> {
    const params = new URLSearchParams({
        anoLetivoId: String(anoLetivoId),
    })

    return gaApi<Topico | null>(
        `topicos?${params.toString()}`,
        {
            method: 'GET',
        },
    ).json()
}