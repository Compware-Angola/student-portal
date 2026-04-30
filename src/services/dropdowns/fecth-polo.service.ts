import { invoiceApi } from "@/lib/invoice-api";

 export interface DataResponse {
  id: number;
  observacao: string;
  designacao: string;
}

export async function fetchPoloDropdown(): Promise<DataResponse[]> {
  const data = await invoiceApi
    .get("shared/polo-dropdown")
    .json<DataResponse[]>();

  return data;
}
