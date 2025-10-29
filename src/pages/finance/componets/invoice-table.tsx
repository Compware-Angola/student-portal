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

export function InvoicesTable({ enrollmentCode }: { enrollmentCode: string }) {
  const { data: academicYear, isLoading: isLoadingAcademicYear } =
    useQueryAcademicYear()
  const columns = useColumnsInvoiceTable(academicYear)

  const [page, setPage] = React.useState(1)
  const { data, isLoading, isError } = useQueryInvoices({
    enrollmentCode,
    page,
  })

  React.useEffect(() => {
    if (isError) {
      toast.error('Erro ao carregar faturas.')
    }
  }, [isError])

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // mostra skeleton durante loading
  if (isLoading || isError || isLoadingAcademicYear) {
    return <InvoicesTableSkeleton />
  }

  return (
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
                        align-middle py-3 font-semibold text-gray-300 uppercase tracking-wide
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/5">
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
                          align-middle py-3
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
                  colSpan={columns.length}
                  className="text-center h-24 text-gray-400"
                >
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
  )
}

function useColumnsInvoiceTable(academicYear: AdemicsYear | undefined) {
  const findAcademicYearDesignation = (codigo: number) => {
    const year = academicYear?.anolectivos?.find(
      (y) => y.codigo === String(codigo),
    )
    return year ? year.designacao : 'Unknown'
  }
  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: 'Codigo',
      header: 'Código',
    },
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
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {row.getValue('estado') === 0 ? (
            <Badge className="rounded-full border-none bg-amber-600/10 text-amber-600 focus-visible:ring-amber-600/20 focus-visible:outline-none dark:bg-amber-400/10 dark:text-amber-400 dark:focus-visible:ring-amber-400/40 [a&]:hover:bg-amber-600/5 dark:[a&]:hover:bg-amber-400/5">
              <span
                className="size-1.5 rounded-full bg-amber-600 dark:bg-amber-400"
                aria-hidden="true"
              />
              Pendente
            </Badge>
          ) : (
            <Badge className="rounded-full border-none bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 focus-visible:outline-none dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5">
              <span
                className="size-1.5 rounded-full bg-green-600 dark:bg-green-400"
                aria-hidden="true"
              />
              Pago
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'ValorAPagar',
      header: 'Valor a Pagar',
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'AOA',
          }).format(row.getValue('ValorAPagar'))}
        </div>
      ),
    },
    {
      accessorKey: 'Baixar',
      header: '',
      cell: ({ row }) => (
        <PaymentReceipt
          invoice={row.original}
          academicYear={findAcademicYearDesignation(row.original.anoLectivo)}
        />
      ),
    },
  ]

  return columns
}
