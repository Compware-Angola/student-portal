import { useEffect, useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, Download, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'

import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useQueryStudentPayments } from '@/hooks/payment/use-query-student-payments'
import { YearSelect } from '@/components/year-select'
import type { StudentPayment } from '@/services/payment/fetch-student-payments.service'
import { ModalDetalhesPagamento } from './modal-detalhes-pagamento'
import { formatCurrency } from '@/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { pdf } from '@react-pdf/renderer'
import { DetailedInvoiceStyledPDF } from './payment-pdf-document.tsx'
import { useQueryPaymentDetails } from '@/hooks/payment/use-query-payment-details'
import { useYearSelect } from '@/components/year-select/use-year-select.ts'

export const NotaPagamento = () => {
  // --- Estados de Controle ---
  const [selectedInvoice, setSelectedInvoice] = useState<StudentPayment | null>(
    null,
  )
  const [isDownloading, setIsDownloading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    undefined,
  )

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(12)
  const [sorting, setSorting] = useState<SortingState>([])

  // --- Hooks de Dados ---
  const { profileData } = useQueryProfile()

  const {
    data: paymentsData,
    isLoading,
    isError,
  } = useQueryStudentPayments({
    codigoMatricula: profileData?.enrollmentCode,
    codigoPreInscricao: profileData?.codigo_preinscricao,
    anoLectivo: selectedYear,
    page,
    limit,
  })

  const { data: detailsData } = useQueryPaymentDetails(
    selectedInvoice?.CodigoFactura,
  )

  // --- Handlers ---
  const handleOpenDetails = (invoice: StudentPayment) => {
    setSelectedInvoice(invoice)
    setIsModalOpen(true)
  }

  const handleCloseDetails = () => {
    setIsModalOpen(false)
    setSelectedInvoice(null)
  }

  const handleDownloadClick = (invoice: StudentPayment) => {
    setSelectedInvoice(invoice)
    setIsDownloading(true)
    setIsModalOpen(false)
  }
  const { academicYears } = useYearSelect(profileData?.enrollmentCode)

  useEffect(() => {
    if (academicYears && !selectedYear) {
      const active = academicYears.find((y) => y.estado === 'Activo')
      if (active) setSelectedYear(String(active.codigo))
    }
  }, [academicYears, selectedYear])

  useEffect(() => {
    if (isDownloading && detailsData && selectedInvoice && profileData) {
      const generatePDF = async () => {
        try {
          const blob = await pdf(
            <DetailedInvoiceStyledPDF
              details={detailsData}
              student={profileData}
              studentPayment={selectedInvoice}
            />,
          ).toBlob()

          const url = URL.createObjectURL(blob)
          window.open(url, '_blank')
        } catch (error) {
          console.error('Erro ao gerar PDF:', error)
        } finally {
          setIsDownloading(false)
          // Só limpamos o selectedInvoice se o modal não estiver aberto
          if (!isModalOpen) setSelectedInvoice(null)
        }
      }

      generatePDF()
    }
  }, [detailsData, isDownloading, selectedInvoice, profileData, isModalOpen])

  // --- Colunas da Tabela ---
  const columns = useMemo<ColumnDef<StudentPayment>[]>(
    () => [
      {
        accessorKey: 'CodigoFactura',
        header: 'Código',
        cell: ({ row }) => (
          <span className="font-bold">{row.original.CodigoFactura}</span>
        ),
      },
      {
        accessorKey: 'TotalPago',
        header: 'Valor Pago',
        cell: ({ row }) => formatCurrency(row.original.VALORAPAGAR ?? 0),
      },
      {
        accessorKey: 'DataFactura',
        header: 'Data',
        cell: ({ row }) => {
          const date = new Date(row.original.DATAFACTURA)
          return date.toLocaleString('pt-PT').replace(',', '')
        },
      },
      {
        id: 'actions',
        header: 'Acções',
        cell: ({ row }) => {
          const isThisDownloading =
            isDownloading &&
            selectedInvoice?.CodigoFactura === row.original.CodigoFactura

          return (
            <div className="flex items-center gap-1">
              <Button
                aria-label="Ver detalhes"
                variant="ghost"
                size="icon"
                className="cursor-pointer"
                onClick={() => handleOpenDetails(row.original)}
              >
                <Eye className="h-5 w-5" />
              </Button>
              <Button
                aria-label="Baixar pdf"
                variant="secondary"
                size="icon"
                className="cursor-pointer"
                disabled={isThisDownloading}
                onClick={() => handleDownloadClick(row.original)}
              >
                {isThisDownloading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Download className="h-5 w-5" />
                )}
              </Button>
            </div>
          )
        },
      },
    ],
    [isDownloading, selectedInvoice?.CodigoFactura],
  )

  const table = useReactTable({
    data: paymentsData?.data ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: paymentsData?.totalPages ?? -1,
  })

  if (isError)
    return (
      <div className="p-4 text-red-500 font-semibold text-center border border-red-200 rounded-lg">
        Erro ao carregar pagamentos. Verifique sua conexão.
      </div>
    )

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider">
              Filtrar por Ano Lectivo
            </label>
            <div className="w-64">
              <YearSelect
                academicYears={academicYears}
                selectedYear={selectedYear}
                onChange={(val) => {
                  setSelectedYear(val)
                  setPage(1)
                }}
              />
            </div>
          </div>
          {/* <Button size="icon" variant="secondary" className="cursor-pointer">
            <Printer className="h-4 w-4" />
          </Button> */}
        </div>

        <div className="pt-4">
          <h2 className="text-xl font-bold border-l-[6px] border-emerald-500 pl-4 h-8 flex items-center">
            Notas de Pagamentos
          </h2>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-b"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="uppercase py-4">
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? 'flex items-center cursor-pointer select-none gap-1'
                            : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{ asc: ' ↑', desc: ' ↓' }[
                          header.column.getIsSorted() as string
                        ] ?? null}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-40 text-center"
                >
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-500" />
                  <p className="mt-2 text-sm font-medium">
                    Sincronizando Recibos...
                  </p>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="transition-colors border-b last:border-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
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
                  className="h-32 text-center italic"
                >
                  Nenhum registro encontrado para este ano lectivo.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Paginação */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-6 text-sm text-slate-500 py-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium">Por página:</span>
          <Select
            value={limit.toString()}
            onValueChange={(value) => {
              setLimit(Number(value))
              setPage(1)
            }}
          >
            <SelectTrigger className="w-16">
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="48">48</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-8">
          <span className="text-xs font-semibold tabular-nums">
            {(page - 1) * limit + 1}-
            {Math.min(page * limit, paymentsData?.total || 0)} of{' '}
            {paymentsData?.total || 0}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= (paymentsData?.totalPages || 1) || isLoading}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <ModalDetalhesPagamento
        selectedInvoice={selectedInvoice}
        student={profileData}
        isOpen={isModalOpen}
        onClose={handleCloseDetails}
      />
    </div>
  )
}
