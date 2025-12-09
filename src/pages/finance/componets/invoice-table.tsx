import React from 'react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Invoice } from '@/services/invoice/get-invoices-by-matricula.service'
import { useQueryInvoices } from '@/hooks/invoice/use-query-invoices'
import { InvoicesTableSkeleton } from './invoices-table-skeleton'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { PaymentReceipt } from '@/components/uma-invoice'
import { useQueryAcademicYear } from '@/hooks/academic-year/use-query-academic-year'
import type { AdemicsYear } from '@/services/academic-year/get-acamedic-year.service'
import {
  Loader2,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useQueryClient } from '@tanstack/react-query'
import { useGenerateReference } from '@/services/finance/generate-reference.service'
import { checkTaskStatus } from '@/services/finance/check-task-status.service'
import PaymentReceipt2 from '@/components/uma-recibo-pagamento'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { YearSelect, type YearSelectProps } from '@/components/year-select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// --- LocalStorage & Polling (100% como tinhas) ---
const PENDING_TASKS_KEY = 'pending_payment_tasks'
interface PendingTask {
  invoiceId: number
  taskId: string
}

function usePollPendingTasks(invoiceId: number, enrollmentCode: string) {
  const queryClient = useQueryClient()
  const [isPolling, setIsPolling] = React.useState(false)

  const refetchInvoices = React.useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['invoices'],
      refetchType: 'all',
    })
  }, [queryClient])

  React.useEffect(() => {
    const pendingTasks: PendingTask[] = JSON.parse(
      localStorage.getItem(PENDING_TASKS_KEY) || '[]',
    )
    const task = pendingTasks.find((t) => t.invoiceId === invoiceId)
    if (!task) return

    setIsPolling(true)
    const interval = setInterval(async () => {
      try {
        const { status } = await checkTaskStatus(task.taskId)
        const finish = (success: boolean) => {
          success
            ? toast.success('Referência gerada com sucesso!')
            : toast.error('Erro na geração da referência.')
          removePendingTask(invoiceId)
          refetchInvoices()
          setIsPolling(false)
          clearInterval(interval)
        }
        if (status === 'completed') finish(true)
        else if (status === 'error') finish(false)
      } catch {
        toast.info('Atualizando lista de faturas...')
        removePendingTask(invoiceId)
        refetchInvoices()
        setIsPolling(false)
        clearInterval(interval)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [invoiceId, enrollmentCode, queryClient, refetchInvoices])

  return isPolling
}

function removePendingTask(invoiceId: number) {
  try {
    const tasks: PendingTask[] = JSON.parse(
      localStorage.getItem(PENDING_TASKS_KEY) || '[]',
    )
    localStorage.setItem(
      PENDING_TASKS_KEY,
      JSON.stringify(tasks.filter((t) => t.invoiceId !== invoiceId)),
    )
  } catch {}
}

function useFindAcademicYearDesignation(academicYear: AdemicsYear | undefined) {
  return (codigo: number) => {
    const year = academicYear?.anolectivos?.find(
      (y) => y.codigo === String(codigo),
    )
    return year ? year.designacao : 'Unknown'
  }
}

function InvoiceDetailsDialog({
  invoice,
  findAcademicYearDesignation,
}: {
  invoice: Invoice
  findAcademicYearDesignation: (c: number) => string
}) {
  const totalMultas = invoice.itens.reduce((s, i) => s + i.Multa, 0)
  const totalPago = invoice.itens.reduce((s, i) => s + i.valor_pago, 0)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          Ver Detalhes
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-5xl !w-[95vw] !max-h-[92vh] p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Nota de Pagamento #{invoice.Codigo}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 space-y-1">
            <div>
              <span className="font-semibold">Data:</span>{' '}
              {new Date(invoice.DataFactura).toLocaleDateString('pt-PT')}
            </div>
            <div>
              <span className="font-semibold">Referência Doc*:</span>{' '}
              {invoice.Referencia || '—'}
            </div>
            {invoice.Descricao && (
              <div className="mt-2 p-2 bg-gray-100 rounded-md text-gray-800 border border-gray-200">
                <span className="font-semibold">Descrição:</span>{' '}
                {invoice.Descricao}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-semibold">Valor Total</p>
              <p className="text-xl font-bold text-primary">
                {new Intl.NumberFormat('pt-PT', {
                  style: 'currency',
                  currency: 'AOA',
                }).format(invoice.TotalPreco)}
              </p>
            </div>
            <div>
              <p className="font-semibold">Itens</p>
              <p className="text-xl font-bold">{invoice.itens.length}</p>
            </div>
            <div>
              <p className="font-semibold">Multas</p>
              <p className="text-xl font-bold text-orange-600">
                {new Intl.NumberFormat('pt-PT', {
                  style: 'currency',
                  currency: 'AOA',
                }).format(totalMultas)}
              </p>
            </div>
            <div>
              <p className="font-semibold">Pago</p>
              <p className="text-xl font-bold text-green-600">
                {new Intl.NumberFormat('pt-PT', {
                  style: 'currency',
                  currency: 'AOA',
                }).format(totalPago)}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="font-semibold mb-3">Itens Detalhados</p>
            <div className="space-y-3">
              {invoice.itens.map((item, idx) => (
                <Card key={item.codigo} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium">
                        {`${idx + 1} -`}{' '}
                        {item.OBS || item.DescricaoServico || 'Sem descrição'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Preço Unitário:</span>
                        <span className="font-mono">
                          {new Intl.NumberFormat('pt-PT', {
                            style: 'currency',
                            currency: 'AOA',
                          }).format(item.preco)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quantidade:</span>
                        <span className="font-mono">{item.Quantidade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-mono font-semibold">
                          {new Intl.NumberFormat('pt-PT', {
                            style: 'currency',
                            currency: 'AOA',
                          }).format(item.Total)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs">
                      {item.taxa_iva > 0 && (
                        <div className="flex justify-between">
                          <span>IVA ({item.taxa_iva}%):</span>
                          <span className="font-mono">
                            {new Intl.NumberFormat('pt-PT', {
                              style: 'currency',
                              currency: 'AOA',
                            }).format(item.valor_iva)}
                          </span>
                        </div>
                      )}
                      {item.Multa > 0 && (
                        <div className="flex justify-between text-orange-600">
                          <span>Multa:</span>
                          <span className="font-mono">
                            {new Intl.NumberFormat('pt-PT', {
                              style: 'currency',
                              currency: 'AOA',
                            }).format(item.Multa)}
                          </span>
                        </div>
                      )}
                      {item.valor_desconto > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Desconto:</span>
                          <span className="font-mono">
                            -
                            {new Intl.NumberFormat('pt-PT', {
                              style: 'currency',
                              currency: 'AOA',
                            }).format(item.valor_desconto)}
                          </span>
                        </div>
                      )}
                      {item.valor_pago > 0 && (
                        <div className="flex justify-between text-green-700 font-medium">
                          <span>Pago:</span>
                          <span className="font-mono">
                            {new Intl.NumberFormat('pt-PT', {
                              style: 'currency',
                              currency: 'AOA',
                            }).format(item.valor_pago)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            {invoice.estado === 1 ? (
              <PaymentReceipt
                invoice={invoice}
                academicYear={findAcademicYearDesignation(invoice.ano_lectivo)}
              />
            ) : (
              <PaymentReceipt2
                invoice={invoice}
                academicYear={findAcademicYearDesignation(invoice.ano_lectivo)}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

type InvoicesTableProps = { enrollmentCode: string } & YearSelectProps

export function InvoicesTable({
  enrollmentCode,
  onChange,
  academicYears,
  selectedYear,
}: InvoicesTableProps) {
  const { data: academicYear, isLoading: isLoadingAcademicYear } =
    useQueryAcademicYear()

  const [page, setPage] = React.useState(1)
  const [statusFilter, setStatusFilter] = React.useState<
    'all' | 'paid' | 'pending'
  >('all')
  const limit = 10

  // FILTRO DE ESTADO NO BACKEND + PAGINAÇÃO
  const { data, isLoading, isError } = useQueryInvoices({
    enrollmentCode,
    page,
    limit,
    academicYear: selectedYear as string,
    status:
      statusFilter === 'all' ? undefined : statusFilter === 'paid' ? 1 : 0,
  })

  const gerarRefMutation = useGenerateReference()
  const findAcademicYearDesignation =
    useFindAcademicYearDesignation(academicYear)

  React.useEffect(() => {
    if (isError) toast.error('Erro ao carregar faturas.')
  }, [isError])

  const columns = useColumnsInvoiceTable({
    gerarRefMutation,
    enrollmentCode,
    findAcademicYearDesignation,
  })

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleYearChange = (value: string) => {
    onChange(value)
    setPage(1)
    setStatusFilter('all')
  }

  const handleStatusChange = (value: 'all' | 'paid' | 'pending') => {
    setStatusFilter(value)
    setPage(1)
  }

  if (isLoading || isError || isLoadingAcademicYear)
    return <InvoicesTableSkeleton />

  const currentPage = data?.page ?? 1
  const totalPages = data?.totalPages ?? 1

  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-2xl font-bold">
            Nota de Pagamentos
          </CardTitle>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <YearSelect
              academicYears={academicYears}
              selectedYear={selectedYear}
              onChange={handleYearChange}
            />

            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-muted" />
                    Todas
                  </div>
                </SelectItem>
                <SelectItem value="paid">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Pagas
                  </div>
                </SelectItem>
                <SelectItem value="pending">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    Pendentes
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <TooltipProvider>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => {
                      const isLastColumn =
                        index === headerGroup.headers.length - 1
                      const isValueColumn = header.column.id === 'ValorAPagar'

                      return (
                        <TableHead
                          key={header.id}
                          className={`
                            ${isLastColumn ? 'text-right pr-6' : 'text-center'}
                            ${isValueColumn ? 'text-right pr-8' : ''}
                            align-middle py-3 font-semibold text-gray-300 uppercase tracking-wide text-xs
                          `}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="hover:bg-muted/50">
                      {row.getVisibleCells().map((cell, index) => {
                        const isLastColumn =
                          index === row.getVisibleCells().length - 1
                        const isValueColumn = cell.column.id === 'ValorAPagar'

                        return (
                          <TableCell
                            key={cell.id}
                            className={`
                              ${isLastColumn ? 'text-right pr-6' : 'text-center'}
                              ${isValueColumn ? 'text-right pr-8 font-medium' : ''}
                              align-middle py-3 text-sm
                            `}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-muted-foreground"
                    >
                      <p className="text-lg font-medium">
                        Nenhuma Nota encontrada
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* PAGINAÇÃO FINAL */}
          <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/10">
            <div className="text-sm text-muted-foreground">
              Página <strong>{currentPage}</strong> de{' '}
              <strong>{totalPages}</strong>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={currentPage === totalPages}
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}

function useColumnsInvoiceTable({
  gerarRefMutation,
  enrollmentCode,
  findAcademicYearDesignation,
}: {
  gerarRefMutation: ReturnType<typeof useGenerateReference>
  enrollmentCode: string
  findAcademicYearDesignation: (codigo: number) => string
}) {
  const columns: ColumnDef<Invoice>[] = [
    { accessorKey: 'Codigo', header: 'Código' },
    {
      accessorKey: 'DataFactura',
      header: 'Data',
      cell: ({ row }) =>
        new Date(row.getValue('DataFactura')).toLocaleDateString('pt-PT'),
    },
    { accessorKey: 'Referencia', header: 'Número Doc*' },
    {
      id: 'referencia_pagamento',
      header: 'Referência de Pagamento',
      cell: ({ row }) => {
        const refs = row.original.referencias_pagamento || []
        if (refs.length === 0)
          return <span className="text-muted-foreground">—</span>

        const ref =
          refs
            .filter((r) => r.Status === 'Pending')
            .sort(
              (a, b) =>
                new Date(b.END_DATE).getTime() - new Date(a.END_DATE).getTime(),
            )[0] || refs[0]

        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="font-mono text-sm font-semibold cursor-help hover:underline">
                {ref.REFERENCE}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                Expira em: <strong>{ref.END_DATE}</strong>
                <br />
                Entidade: <strong>{ref.ENTITY_ID}</strong>
              </p>
            </TooltipContent>
          </Tooltip>
        )
      },
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ row }) => {
        const estado = row.getValue('estado') as number
        return (
          <div className="flex justify-center">
            {estado === 0 ? (
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-700"
              >
                <span className="size-1.5 rounded-full bg-amber-600 mr-1.5" />
                Pendente
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700"
              >
                <span className="size-1.5 rounded-full bg-green-600 mr-1.5" />
                Pago
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'TotalPreco',
      header: 'Valor a Pagar',
      cell: ({ row }) => {
        const totalPreco = row.getValue('TotalPreco') as number | undefined
        const valorAPagar = row.original.ValorAPagar as number | undefined
        const valorFinal = valorAPagar || totalPreco

        if (
          valorFinal === null ||
          valorFinal === undefined ||
          valorFinal === 0
        ) {
          return <div className="text-right font-medium text-gray-400">N/A</div>
        }

        return (
          <div className="text-right font-medium">
            {new Intl.NumberFormat('pt-PT', {
              style: 'currency',
              currency: 'AOA',
            }).format(valorFinal)}
          </div>
        )
      },
    },
    {
      id: 'acoes',
      header: 'Ações',
      cell: ({ row }) => {
        const invoice = row.original
        const refs = invoice.referencias_pagamento || []
        const temReferencia = refs.length > 0
        const estaPendente = invoice.estado === 0
        const isPolling = usePollPendingTasks(
          Number(invoice.Codigo),
          enrollmentCode,
        )

        return (
          <div className="flex items-center justify-end gap-2">
            {!temReferencia && estaPendente ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    disabled={gerarRefMutation.isPending || isPolling}
                  >
                    {gerarRefMutation.isPending || isPolling ? (
                      <>
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      'Gerar Referência'
                    )}
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Gerar nova referência de pagamento?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação irá gerar uma nova referência Multicaixa/MB Way
                      para a Nota de Pagamento{' '}
                      <span className="font-medium">{invoice.Codigo}</span>.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        gerarRefMutation.mutate({
                          codigoFactura: invoice.Codigo,
                        })
                      }
                      disabled={gerarRefMutation.isPending || isPolling}
                    >
                      {gerarRefMutation.isPending || isPolling ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />A
                          gerar...
                        </>
                      ) : (
                        'Gerar'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <PaymentReceipt
                invoice={invoice}
                academicYear={findAcademicYearDesignation(invoice.ano_lectivo)}
                showDownloadButton={false}
                showPrintButton={true}
              />
            )}

            <InvoiceDetailsDialog
              invoice={invoice}
              findAcademicYearDesignation={findAcademicYearDesignation}
            />
          </div>
        )
      },
    },
  ]

  return columns
}
