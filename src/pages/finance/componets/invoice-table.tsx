'use client'

import * as React from 'react'
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

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useQueryClient } from '@tanstack/react-query'
import { useGenerateReference } from '@/services/finance/generate-reference.service'
import { checkTaskStatus } from '@/services/finance/check-task-status.service'

// ✅ IMPORTA O SELECT CERTO (SHADCN)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'


// --- Chave do localStorage ---
const PENDING_TASKS_KEY = 'pending_payment_tasks'

interface PendingTask {
  invoiceId: number
  taskId: string
}

function removePendingTask(invoiceId: number) {
  const pendingTasks: PendingTask[] = JSON.parse(localStorage.getItem(PENDING_TASKS_KEY) || '[]')
  const updated = pendingTasks.filter(t => t.invoiceId !== invoiceId)
  localStorage.setItem(PENDING_TASKS_KEY, JSON.stringify(updated))
}

function usePollPendingTasks(invoiceId: number, enrollmentCode: string) {
  const queryClient = useQueryClient()
  const [isPolling, setIsPolling] = React.useState(false)

  React.useEffect(() => {
    const pendingTasks: PendingTask[] = JSON.parse(localStorage.getItem(PENDING_TASKS_KEY) || '[]')
    const task = pendingTasks.find(t => t.invoiceId === invoiceId)
    if (!task) return

    setIsPolling(true)
    const interval = setInterval(async () => {
      try {
        const { status } = await checkTaskStatus(task.taskId)

        if (status === 'completed') {
          toast.success('Referência gerada com sucesso!')
          removePendingTask(invoiceId)
          queryClient.invalidateQueries({ queryKey: ['invoices', enrollmentCode] })
          setIsPolling(false)
        }
      } catch (error) {
        removePendingTask(invoiceId)
        queryClient.invalidateQueries({ queryKey: ['invoices', enrollmentCode] })
        setIsPolling(false)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [invoiceId, enrollmentCode, queryClient])

  return isPolling
}


// === Busca ano lectivo ===
function useFindAcademicYearDesignation(academicYear: AdemicsYear | undefined) {
  return (codigo: number) => {
    const year = academicYear?.anolectivos?.find((y) => y.codigo === String(codigo))
    return year ? year.designacao : 'Unknown'
  }
}


// =================== COMPONENTE PRINCIPAL ======================
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

  const [page, setPage] = React.useState(1)
  const [selectedAcademicYear, setSelectedAcademicYear] = React.useState(String(defaultAcademicYear))

  const { data, isLoading, isError } = useQueryInvoices({
    enrollmentCode,
    page,
    academicYear: selectedAcademicYear,
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


  if (isLoading || isLoadingAcademicYear) return <InvoicesTableSkeleton />


  // ✅ AGORA O SELECT ESTÁ AQUI NO CARD
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Faturas</CardTitle>

        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />

          <Select
            value={selectedAcademicYear}
            onValueChange={(value) => {
              setSelectedAcademicYear(value)
              setPage(1)
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

      <CardContent>
        <TooltipProvider>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center h-24">
                      Nenhuma fatura encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end gap-2 py-4">
            <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
              Anterior
            </Button>

            <span className="text-sm">
              Página {data?.page} de {data?.totalPages}
            </span>

            <Button size="sm" variant="outline" onClick={() => setPage((p) => p + 1)} disabled={data?.page === data?.totalPages}>
              Próxima
            </Button>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}


// ===================== COLUNAS =====================
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
    {
      accessorKey: 'Referencia',
      header: 'Referência',
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ row }) => {
        const estado = row.getValue('estado') as number
        return (
          <Badge
            variant="secondary"
            className={estado === 0 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}
          >
            {estado === 0 ? 'Pendente' : 'Pago'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'ValorAPagar',
      header: 'Valor',
      cell: ({ row }) =>
        new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'AOA' }).format(
          row.getValue('ValorAPagar') || 0
        ),
    },
    {
      id: 'acoes',
      header: 'Ações',
      cell: ({ row }) => {
        const invoice = row.original
        const refs = invoice.referencias_pagamento || []
        const hasReference = refs.length > 0
        const isPending = invoice.estado === 0
        const isPolling = usePollPendingTasks(invoice.Codigo, enrollmentCode)

        return (
          <div className="flex items-center gap-2 justify-end">

            {isPending && !hasReference && (
              <Button
                size="sm"
                variant="outline"
                disabled={gerarRefMutation.isPending || isPolling}
                onClick={() =>
                  gerarRefMutation.mutate({ codigoFactura: invoice.Codigo })
                }
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
            <PaymentReceipt
              invoice={invoice}
              academicYear={findAcademicYearDesignation(invoice.ano_lectivo)}
            />
          </div>
        )
      },
    },
  ]

  return columns
}
