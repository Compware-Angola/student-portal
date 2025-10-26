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
import type { Invoice } from '@/services/invoice/get-invoices-by-matricula'
import { useQueryInvoices } from '@/hooks/invoice/use-query-invoices'
import { InvoicesTableSkeleton } from './invoices-table-skeleton'
import { toast } from 'sonner'

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
    accessorKey: 'ValorAPagarExtenso',
    header: 'Extenso',
  },
]

export function InvoicesTable({
  codigoMatricula,
}: {
  codigoMatricula: string
}) {
  const [page, setPage] = React.useState(1)
  const { data, isLoading, isError } = useQueryInvoices({
    codigoMatricula,
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
  if (isLoading || isError) {
    return <InvoicesTableSkeleton />
  }

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center h-24"
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
