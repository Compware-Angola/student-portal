

import { invoiceApi } from '@/lib/invoice-api';

export type PaymentInvoiceItem = {
 
    p_N_Operacao_Bancaria: string | null;
    p_forma_pagamento: string | null;
    p_valor_depositado: string;
    p_status_pagamento: 'pendente' | 'concluido' | string;
    p_statusMovimento: number;
    CodigoPagamento: number;
    DataPagamento: string; // Ex: "2025-10-14"
    DataRegistoPagamento: string; // Ex: "2025-10-14T10:23:39.000Z"
    
    // DADOS DA FATURA (f_)
    f_DataFactura: string; // Ex: "2025-10-14T11:23:39.000Z"
    f_Referencia: string;
    f_ValorAPagar: number;
    CodigoFactura: number;
    Descricao_factura: string | null;
    EstadoFactura: number;
    TotalBrutoFactura: number;
    TotalMultaFactura: number;

    // DADOS DOS ITENS (sem prefixo)
    CodigoItem: number;
    CodigoProduto: number;
    ObservacaoItem: string | null;
    Quantidade: number | null;
    PrecoUnitario: number;
    TotalItem: number;
    MesReferencia: string | null;
    MultaItem: number;
    valor_pago: number;
    taxa_iva: number;
    
    // DADOS DO PRODUTO (Descricao_produto)
    Descricao_produto: string;
};

// 2. Interface para a Resposta Paginada (Modelo PagedResult)
export type PaymentInvoicePagedResponse = {
    data: PaymentInvoiceItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

// 3. Tipagem para os Parâmetros de Filtro (se houver)
export type PaymentInvoiceFilterParams = {
    academicYear: string;
    preRegistrationCode: string;
    limit?: number;
    page?: number;
};
/**
 * Função para buscar pagamentos, faturas e itens detalhados de um estudante.
 * * @param params Parâmetros de filtro e paginação.
 * @returns {Promise<PaymentInvoicePagedResponse>} 
 */
export async function getPayments(
    params: PaymentInvoiceFilterParams,
): Promise<PaymentInvoicePagedResponse> {
    
    const { 
        academicYear, 
        preRegistrationCode, 
        limit = 10, 
        page = 1 
    } = params;

    // Constrói a URL da API com os parâmetros de caminho (path) e query
    // NOTA: Ajuste o endpoint 'payment/detailed-invoices' conforme o seu Controller
    const url = `payment/get/${academicYear}/${preRegistrationCode}`;
    
    // Passa os parâmetros de paginação como query params
    const queryParams = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
    }).toString();

    return invoiceApi
        .get(`${url}?${queryParams}`)
        .json<PaymentInvoicePagedResponse>();
}