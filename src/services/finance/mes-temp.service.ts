import { invoiceApi } from "@/lib/invoice-api";
type MestTemp = {
  designacao: string
  isencao: number
  ordem_mes: number
  ano_lectivo: number
  prestacao: number
  activo: number
  activo_posgraduacao: number
  data_limite: string
  data_inicial: string
  data_final: string
  data_final_desconto: string | null
  semestre: number
  semestre_posgraduacao: number
  id: number
}


export async function getMesTemp(codigoAnoLectivo: number, prestacao: number) {
    const res = await invoiceApi.get<MestTemp>(`payment/mes-temp/${codigoAnoLectivo}/${prestacao}`).json();
    return res;
}