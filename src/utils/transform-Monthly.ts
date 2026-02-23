import type { Monthly } from "@/pages/finance/componets/payment-list-monthly";
import type { Mensalidade } from "@/types/finance-api-response";
import { formatCurrency } from "./format-currency";

const transformMonthly = (monthlys: Mensalidade[]): Monthly[] => {

  return monthlys.map((monthly) => {
    const valorBase =
      monthly.status_pagamento === 1
        ? monthly.valor_pago
        : monthly.total;
    const desconto = Number(monthly.desconto)
    const mensalidade = Number(monthly.mensalidade)

    const  percentualDesconto =
    mensalidade > 0 ? ( desconto/ mensalidade) * 100 : 0;

  const descricaoDesconto =
    desconto > 0
      ? ` Pagamento aplicado desconto de ${percentualDesconto.toFixed(0)}%`
      : null;
    return {
      id: monthly.mes_temp_id,
      month: monthly.mes,
      description: `Mensalidade - ${monthly.semestre} º Semestre`,
      valorPago: String(monthly.valor_pago),
      tipoDesconto: "Percentual",
      mensalidade: formatCurrency(monthly.mensalidade ?? 0),
      valorBase: String(valorBase),
      valorAPagar: String(monthly.total),
      multa: formatCurrency(monthly.multa ?? 0),
      desconto: formatCurrency(monthly.desconto ?? 0),
      formaPagamento: null,
      dataPagamento: null,
      dueDate: monthly.data_vencimento,
      status: Number(monthly.status_pagamento),
      reference: monthly.reference,
      observacoes: descricaoDesconto,
      bolseiro: 1
    };
  });
};

export { transformMonthly };
