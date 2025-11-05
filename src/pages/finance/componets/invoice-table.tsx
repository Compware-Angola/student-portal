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
import { Loader2, Eye, Calendar } from 'lucide-react'
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
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { useQueryClient } from '@tanstack/react-query'
import { useGenerateReference } from '@/services/finance/generate-reference.service'
import { checkTaskStatus } from '@/services/finance/check-task-status.service'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import PaymentReceipt2 from '@/components/uma-recibo-pagamento'

// --- Chave do localStorage ---
const PENDING_TASKS_KEY = 'pending_payment_tasks'

interface PendingTask {
  invoiceId: number
  taskId: string
}

// --- Hook de Polling (CORRIGIDO) ---
function usePollPendingTasks(invoiceId: number, enrollmentCode: string) {
  const queryClient = useQueryClient()
  const [isPolling, setIsPolling] = React.useState(false)

  // Função auxiliar para invalidar e refetch
  const refetchInvoices = React.useCallback(() => {
    // CORREÇÃO CRÍTICA: Usar refetchType: 'all' para garantir que todas as queries
    // que começam com ['invoices', enrollmentCode] sejam atualizadas,
    // independentemente da página ou ano letivo específico na chave.
    queryClient.invalidateQueries({
      queryKey: ['invoices'],
      refetchType: 'all',
    })
    console.log(`[Polling] Invalidação de queries para ${enrollmentCode} solicitada.`)
  }, [enrollmentCode, queryClient])

  React.useEffect(() => {
    const pendingTasks: PendingTask[] = JSON.parse(localStorage.getItem(PENDING_TASKS_KEY) || '[]')
    const task = pendingTasks.find(t => t.invoiceId === invoiceId)
    if (!task) return

    setIsPolling(true)
    const interval = setInterval(async () => {
      console.log(`[Polling] Verificando status para a fatura ${invoiceId}...`)
      try {
        const { status } = await checkTaskStatus(task.taskId)

        const finishPolling = (isSuccess: boolean) => {
          if (isSuccess) {
            toast.success('Referência gerada com sucesso! Atualizando faturas.')
          } else {
            toast.error('Erro na geração da referência. Tente novamente.')
          }
          removePendingTask(invoiceId)
          refetchInvoices()
          setIsPolling(false)
          clearInterval(interval) // Parar o polling
        }

        if (status === 'completed') {
          finishPolling(true)
        } else if (status === 'error') {
          finishPolling(false)
        }

      } catch (error) {
        // Assume que qualquer erro de rede ou na resposta significa que o processo
        // foi finalizado ou a task não existe mais no backend.
        console.error('[Polling] Erro de API ou task finalizada no backend:', error)
        toast.info('Processo finalizado ou erro de comunicação. Atualizando a lista de faturas.')
        removePendingTask(invoiceId)
        refetchInvoices()
        setIsPolling(false)
        clearInterval(interval) // Parar o polling
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [invoiceId, enrollmentCode, queryClient, refetchInvoices])

  return isPolling
}

// --- Remove task do localStorage (Melhorada para logging) ---
function removePendingTask(invoiceId: number) {
  try {
    const pendingTasks: PendingTask[] = JSON.parse(localStorage.getItem(PENDING_TASKS_KEY) || '[]')
    const updated = pendingTasks.filter(t => t.invoiceId !== invoiceId)
    localStorage.setItem(PENDING_TASKS_KEY, JSON.stringify(updated))
    console.log(`[LocalStorage] Task ${invoiceId} removida com sucesso.`)
  } catch (e) {
    console.error(`[LocalStorage] Falha ao remover task ${invoiceId}:`, e)
  }
}

// --- Função para buscar ano letivo ---
function useFindAcademicYearDesignation(academicYear: AdemicsYear | undefined) {
  return (codigo: number) => {
    // Garantir que a comparação de código (number) seja correta
    const year = academicYear?.anolectivos?.find((y) => y.codigo === String(codigo))
    return year ? year.designacao : 'Unknown'
  }
}

// --- Modal de Detalhes da Fatura (Sem Alterações) ---
function InvoiceDetailsDialog({
  invoice,
  findAcademicYearDesignation,
}: {
  invoice: Invoice
  findAcademicYearDesignation: (codigo: number) => string
}) {
  const totalMultas = invoice.itens.reduce((sum, i) => sum + i.Multa, 0)
  const totalPago = invoice.itens.reduce((sum, i) => sum + i.valor_pago, 0)

  return (

    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          Ver Detalhes
        </Button>
      </DialogTrigger>

      {/* MODAL GIGANTE */}
      <DialogContent className="!max-w-5xl !w-[95vw] !max-h-[92vh] p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Nota de Pagamento #{invoice.Codigo}</DialogTitle>
          <DialogDescription className="text-base">
            Data: {new Date(invoice.DataFactura).toLocaleDateString('pt-PT')} |
            Referência Doc*: {invoice.Referencia || '—'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Resumo */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-semibold">Valor Total</p>
              <p className="text-xl font-bold text-primary">
                {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'AOA' }).format(invoice.ValorAPagar)}
              </p>
            </div>
            <div>
              <p className="font-semibold">Itens</p>
              <p className="text-xl font-bold">{invoice.itens.length}</p>
            </div>
            <div>
              <p className="font-semibold">Multas</p>
              <p className="text-xl font-bold text-orange-600">
                {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'AOA' }).format(totalMultas)}
              </p>
            </div>
            <div>
              <p className="font-semibold">Pago</p>
              <p className="text-xl font-bold text-green-600">
                {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'AOA' }).format(totalPago)}
              </p>
            </div>
          </div>

          {/* Itens Detalhados */}
          <div className="border-t pt-4">
            <p className="font-semibold mb-3">Itens Detalhados</p>
            <div className="space-y-3">
              {invoice.itens.map((item, idx) => (
                <Card key={item.codigo} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium">{item.MesDesignacao || `Item ${idx + 1}`}</p>
                      <p className="text-muted-foreground text-xs">
                        {item.OBS || item.DescricaoServico || 'Sem descrição'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Preço Unitário:</span>
                        <span className="font-mono">
                          {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'AOA' }).format(item.preco)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quantidade:</span>
                        <span className="font-mono">{item.Quantidade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-mono font-semibold">
                          {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'AOA' }).format(item.Total)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs">
                      {item.taxa_iva > 0 && (
                        <div className="flex justify-between">
                          <span>IVA ({item.taxa_iva}%):</span>
                          <span className="font-mono">
                            {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'AOA' }).format(item.valor_iva)}
                          </span>
                        </div>
                      )}
                      {item.Multa > 0 && (
                        <div className="flex justify-between text-orange-600">
                          <span>Multa:</span>
                          <span className="font-mono">
                            {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'AOA' }).format(item.Multa)}
                          </span>
                        </div>
                      )}
                      {item.valor_desconto > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Desconto ({item.descontoProduto}%):</span>
                          <span className="font-mono">
                            -{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'AOA' }).format(item.valor_desconto)}
                          </span>
                        </div>
                      )}
                      {item.valor_pago > 0 && (
                        <div className="flex justify-between text-green-700 font-medium">
                          <span>Pago:</span>
                          <span className="font-mono">
                            {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'AOA' }).format(item.valor_pago)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3 pt-4 border-t">
            <>
              {invoice.estado === 1 ? (
                <PaymentReceipt
                  invoice={invoice}
                  academicYear={findAcademicYearDesignation(invoice.ano_lectivo)}
                />
              ) : (
                // Conteúdo 2: FATURA PENDENTE (Seu objetivo)
                <>

                     <PaymentReceipt2
                  invoice={invoice}
                  academicYear={findAcademicYearDesignation(invoice.ano_lectivo)}
                />
                </>
              )}
            </>

          </div>
        </div>
      </DialogContent>
    </Dialog>

  )
}

export function InvoicesTable({
  academicYear: defaultAcademicYear,
  enrollmentCode,
  academicYears,
}: {
  academicYear: string;
  enrollmentCode: string;
  academicYears: AdemicsYear;
}) {
  const { data: academicYear, isLoading: isLoadingAcademicYear } = useQueryAcademicYear()
  const [selectedAcademicYear, setSelectedAcademicYear] = React.useState(String(defaultAcademicYear));

  const [page, setPage] = React.useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useQueryInvoices({
    enrollmentCode,
    page,
    limit,
    academicYear: selectedAcademicYear // Filtro aplicado corretamente
  })

  const gerarRefMutation = useGenerateReference()

  const findAcademicYearDesignation = useFindAcademicYearDesignation(academicYear)

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

  // CORREÇÃO: No Select, ao mudar o valor, o estado local e a página são resetados
  const handleYearChange = (value: string) => {
    setSelectedAcademicYear(value)
    setPage(1) // Volta para a primeira página ao mudar o ano letivo
  }

  if (isLoading || isError || isLoadingAcademicYear) {
    return <InvoicesTableSkeleton />
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Faturas</CardTitle>

        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />

          <Select
            value={selectedAcademicYear}
            onValueChange={handleYearChange} // Usando a função de tratamento
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
      <TooltipProvider>
        <div className="w-full">
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => {
                      const isLastColumn = index === headerGroup.headers.length - 1
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
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="hover:bg-muted/5">
                      {row.getVisibleCells().map((cell, index) => {
                        const isLastColumn = index === row.getVisibleCells().length - 1
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
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center h-24 text-gray-400">
                      Nenhuma fatura encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end gap-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <span className="text-sm">
              Página {data?.page} de {data?.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={data?.page === data?.totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      </TooltipProvider>
    </Card>
  )
}

// --- Colunas ---
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
    {
      accessorKey: 'Codigo',
      header: 'Código',
    },
    {
      accessorKey: 'DataFactura',
      header: 'Data',
      cell: ({ row }) => new Date(row.getValue('DataFactura')).toLocaleDateString('pt-PT'),
    },
    {
      accessorKey: 'Referencia',
      header: 'Referência Doc*',
    },
    {
      id: 'referencia_pagamento',
      header: 'Referência de Pagamento',
      cell: ({ row }) => {
        const refs = row.original.referencias_pagamento || []
        if (refs.length === 0) return <span className="text-muted-foreground">—</span>

        const ref = refs
          .filter((r) => r.Status === 'Pending')
          .sort((a, b) => new Date(b.END_DATE).getTime() - new Date(a.END_DATE).getTime())[0]
          || refs[0]

        const validade = new Date(ref.END_DATE).toLocaleDateString('pt-PT')

        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="font-mono text-sm font-semibold cursor-help hover:underline">
                {ref.REFERENCE}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                Expira em: <strong>{validade}</strong>
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
              <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                <span className="size-1.5 rounded-full bg-amber-600 mr-1.5" />
                Pendente
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
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
        const totalPreco = row.getValue('TotalPreco') as number | undefined;
        const valorAPagar = row.original.ValorAPagar as number | undefined; 
        const valorFinal = valorAPagar || totalPreco;

        if (valorFinal === null || valorFinal === undefined || valorFinal === 0) {
          return (
            <div className="text-right font-medium text-gray-400">
              N/A
            </div>
          );
        }

        return (
          <div className="text-right font-medium">
            {new Intl.NumberFormat('pt-PT', {
              style: 'currency',
              currency: 'AOA',
            }).format(valorFinal)}
          </div>
        );
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
        const isPolling = usePollPendingTasks(invoice.Codigo, enrollmentCode)

        return (
          <div className="flex items-center justify-end gap-2">
            {/* Gerar Referência */}
            {!temReferencia && estaPendente && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs"
                disabled={gerarRefMutation.isPending || isPolling}
                onClick={() => {
                  if (confirm('Gerar nova referência de pagamento?')) {
                    gerarRefMutation.mutate({ codigoFactura: invoice.Codigo })
                  }
                }}
              >
                {(gerarRefMutation.isPending || isPolling) ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  'Gerar Referência'
                )}
              </Button>
            )}

            {/* Ver Detalhes */}
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
