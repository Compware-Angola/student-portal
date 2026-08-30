import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, FileText, Wallet } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useQueryCurrentAcademicYear } from '@/hooks/academic-year/use-query-current-academic-year'
import { useQueryInvoices } from '@/hooks/invoice/use-query-invoices'
import { formatCurrency } from '@/utils/format-currency'

function formatDate(value?: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('pt-AO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function PendingFinanceAlert() {
  const navigate = useNavigate()
  const { profileData } = useQueryProfile()

  const enrollmentCode = profileData?.enrollmentCode

  const { data: currentAcademicYear } = useQueryCurrentAcademicYear(
    profileData?.codigo_tipo_candidatura,
  )
  const academicYearCode = currentAcademicYear?.codigo
    ? Number(currentAcademicYear.codigo)
    : undefined
  const yearLabel = currentAcademicYear?.designacao ?? ''

  const { data: invoicesData, isLoading: invoicesLoading } = useQueryInvoices({
    academicYear: academicYearCode ? String(academicYearCode) : '',
    enrollmentCode,
    status: 0,
    page: 1,
    limit: 100,
  })

  const [open, setOpen] = useState(false)

  const pendingInvoices = useMemo(
    () => (invoicesData?.data ?? []).filter((inv) => inv.estado === 0),
    [invoicesData],
  )

  const invoicesTotal = useMemo(
    () =>
      pendingInvoices.reduce(
        (sum, inv) => sum + (inv.ValorAPagar ?? inv.TotalPreco ?? 0),
        0,
      ),
    [pendingInvoices],
  )

  const hasPending = pendingInvoices.length > 0
  const isLoading = invoicesLoading

  useEffect(() => {
    if (!isLoading && hasPending) setOpen(true)
  }, [isLoading, hasPending])

  const handleClose = () => {
    setOpen(false)
  }

  const handleGoToFinance = () => {
    handleClose()
    navigate('/financas')
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) handleClose()
      }}
    >
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader className="text-left">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-warning/15">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl">
                Pagamentos por regularizar
              </DialogTitle>
              <DialogDescription>
                {yearLabel
                  ? `Identificámos notas de pagamento pendentes no ano lectivo ${yearLabel}. Consulte os detalhes abaixo e regularize a sua situação.`
                  : 'Identificámos notas de pagamento pendentes na sua conta. Consulte os detalhes abaixo e regularize a sua situação.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex items-center gap-2 text-destructive">
              <FileText className="h-4 w-4" />
              <p className="text-sm font-semibold">Notas de Pagamento</p>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {formatCurrency(invoicesTotal)}
            </p>
            <p className="text-xs text-muted-foreground">
              {pendingInvoices.length}{' '}
              {pendingInvoices.length === 1
                ? 'nota pendente'
                : 'notas pendentes'}
            </p>
          </div>
        </div>

        {pendingInvoices.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Notas de pagamento pendentes</h3>
            </div>

            <div className="space-y-2">
              {pendingInvoices.map((invoice) => (
                <div
                  key={invoice.Codigo}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <p className="font-medium">
                      Nota de Pagamento #{invoice.Codigo}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {invoice.Referencia
                        ? `Nº Doc: ${invoice.Referencia}`
                        : `Emitida em ${formatDate(invoice.DataFactura)}`}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-bold">
                      {formatCurrency(
                        invoice.ValorAPagar ?? invoice.TotalPreco ?? 0,
                      )}
                    </p>
                    <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">
                      Pendente
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={handleClose}>
            Entendi
          </Button>
          <Button onClick={handleGoToFinance}>
            <Wallet className="h-4 w-4" />
            Ver página de finanças
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
