import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Receipt } from 'lucide-react';
import { useFinance } from '../hooks/use-finance';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useQueryFinanceMonthlyFee } from '@/hooks/finance/use-query-finance-monthly-fee';
import type { AdemicsYear } from '@/services/academic-year/get-acamedic-year.service';



export function PaymentList({
  academicYear: defaultAcademicYear,
  enrollmentCode,
  academicYears
}: {
  academicYear: string;
  enrollmentCode: string;
  academicYears: AdemicsYear;
}) {
  const { getStatusBadge, handleGenerateReference } = useFinance();

  const [selectedAcademicYear, setSelectedAcademicYear] = useState(String(defaultAcademicYear));

  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: monthlyFeeData,
    isLoading,
    isError,
  } = useQueryFinanceMonthlyFee({
    academicYear: selectedAcademicYear,
    enrollmentCode,
    page,
    limit,
  });

  const payments = monthlyFeeData?.data ?? [];
  const totalPages = monthlyFeeData?.totalPages ?? 1;

  const getPaymentStatus = (
    status: number | string
  ): 'paid' | 'pending' | 'upcoming' => {
    const normalized = Number(status);
    switch (normalized) {
      case 1:
        return 'paid';
      case 2:
        return 'upcoming';
      default:
        return 'pending';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Meses de Pagamento</CardTitle></CardHeader>
        <CardContent>A carregar meses de pagamento...</CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader><CardTitle>Erro</CardTitle></CardHeader>
        <CardContent>Não foi possível carregar os dados. Tente mais tarde.</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Meses de Pagamento</CardTitle>

        <div className="flex items-center gap-2">
          
<Calendar className="h-5 w-5 text-muted-foreground" />
          <Select
            value={selectedAcademicYear}
            onValueChange={(value) => {
              setSelectedAcademicYear(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o Ano Lectivo" />
            </SelectTrigger>

            <SelectContent>
              {academicYears.anolectivos.map((year) => (
                <SelectItem key={year.codigo} value={year.codigo}>
                  {year.designacao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {payments.length === 0 ? (
          <p className="text-center text-muted-foreground p-4">
            Nenhuma mensalidade encontrada.
          </p>
        ) : (
          payments.map((p) => (
            <div
              key={p.id_item}
              className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div>
                <p className="font-medium">{p.mes}</p>
                <p className="text-sm text-muted-foreground">
                  Vencimento: {new Date(p.data_limite).toLocaleDateString('pt-AO')}
                </p>

                {p.reference && (
                  <p className="text-xs text-muted-foreground">
                    Referência: <strong>{p.reference}</strong>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right space-y-2">
                  <p className="font-bold">{p.total_item} Kz</p>
                  {getStatusBadge(getPaymentStatus(p.status_pagamento))}
                </div>
                {getPaymentStatus(p.status_pagamento) !== 'paid' && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!p.codigo_factura}
                    onClick={() => handleGenerateReference(p.codigo_factura as number)
                    }
                  >
                    <Receipt className="mr-2 h-4 w-4" />
                    Gerar Referência
                  </Button>
                )}
              </div>
            </div>
          ))
        )}

        {/* PAGINAÇÃO */}
        <div className="flex justify-between pt-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Anterior
          </Button>

          <span className="text-sm text-muted-foreground">
            Página {page} / {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Próximo →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
