import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Pagination } from '@/components/pagination'
import { PaymentAlert } from '@/components/payment-alert'
import { useProfileData } from '@/hooks/use-profile-data'
import { getFinancial } from '@/services/financial.service'
import { PaymentItem } from './componets/payment-item'
import { FinanceSkeleton } from './componets/finance-skeleton'

export function Finance() {
  const [currentPage, setCurrentPage] = useState(0)
  const { profileData } = useProfileData()

  const enrollmentCode = profileData?.enrollment?.enrollmentCode
  const isEnrollmentActive =
    profileData?.enrollment?.enrollmentStatus === 'ACTIVE_REGULAR'

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['financial', currentPage, enrollmentCode],
    enabled: !!enrollmentCode && isEnrollmentActive,
    queryFn: () =>
      getFinancial({
        enrollmentCode: enrollmentCode!,
        page: currentPage,
        size: 100,
      }),
  })

  // Tratamento de erro
  if (isError && error) {
    toast.error(error.message)
  }

  // Estados de loading
  if (isLoading || !profileData) {
    return <FinanceSkeleton />
  }

  // Verificação de matrícula
  if (!isEnrollmentActive && enrollmentCode !== undefined) {
    return <PaymentAlert />
  }

  const payments = data?.content ?? []
  const totalPages = data?.totalPages ?? 0
  const existMorePages = data?.last ?? false

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finanças</h1>
        <p className="text-muted-foreground">
          Gerencie suas mensalidades e pagamentos
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 Kz</div>
            <p className="text-xs text-muted-foreground">-</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">0 Kz</div>
            <p className="text-xs text-muted-foreground">-</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total do Ano</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 Kz</div>
            <p className="text-xs text-muted-foreground">12 mensalidades</p>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.length > 0 ? (
              payments.map((payment) => (
                <PaymentItem key={payment.id} data={payment} />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Nenhum Dado Encontrado
              </p>
            )}
          </div>

          {payments.length > 0 && (
            <div className="mt-10">
              <Pagination
                last={existMorePages}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
