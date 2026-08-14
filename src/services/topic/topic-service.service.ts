import { gaApi } from '@/lib/ga-api'

export type Topico = {
    id: number
    designacao: string
    ano_lectivo_id: number
    ano_letivo: string
    arquivo: string
    created_at: string
    updated_at: string | null
}

type TopicosResponse = {
    data: Topico[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export async function getTopicoByAnoLetivo(
    anoLetivoId: number,
): Promise<Topico | null> {
    const params = new URLSearchParams({
        anoLetivoId: String(anoLetivoId),
        page: '1',
        limit: '1',
    })

    const response = await gaApi<TopicosResponse>(
        `exames-de-acesso/topicos?${params}`,
        {
            method: 'GET',
        },
    ).json()

    return response.data[0] ?? null
}