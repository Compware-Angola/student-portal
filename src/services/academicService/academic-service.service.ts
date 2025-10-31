
import { apexApi } from '@/lib/apex-api'
export type ServiceItem = {
    codigo: string;
    descricao: string;
    preco: string;
    tipo_servico: string;
    estado: string;
    disponibilizar_aluno: 'SIM' | 'NAO' | string;
    visualizar_no_portal: 'SIM' | 'NAO' | string;
    codigo_ano_lectivo: string;
}

// Interface para a resposta completa da API (o objeto com a chave "servicos")
export type AvailableServicesResponse= {
    servicos: ServiceItem[];
    // Se a API tiver outros campos além de "servicos", adicione-os aqui
}

/**
 * Função para buscar os dados financeiros do estudante (mensalidades e referências).
 *
 * @returns {Promise<AvailableServicesResponse>} 
 */
export async function getAcademicService(
    academicYear: string,
    poloId: string,
): Promise<AvailableServicesResponse> {

    return apexApi
        .get(`service/all/${academicYear}/${poloId}`)
        .json<AvailableServicesResponse>()
}