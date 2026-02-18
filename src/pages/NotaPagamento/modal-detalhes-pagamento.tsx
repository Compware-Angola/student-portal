import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, Printer } from 'lucide-react'
import { useQueryPaymentDetails } from '@/hooks/payment/use-query-payment-details'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableHeader,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/utils'
import { pdf } from '@react-pdf/renderer'
import type { StudentPayment } from '@/services/payment/fetch-student-payments.service'
import type { ProfileData } from '@/types/profile'
import { DetailedInvoiceStyledPDF } from './payment-pdf-document.tsx'

interface ModalDetalhesPagamentoProps {
  selectedInvoice: StudentPayment | null
  student: ProfileData | null | undefined
  isOpen: boolean
  onClose: () => void
}

export const ModalDetalhesPagamento = ({
  selectedInvoice,
  student,
  isOpen,
  onClose,
}: ModalDetalhesPagamentoProps) => {
  const { data: detailsData, isLoading } = useQueryPaymentDetails(
    selectedInvoice?.CodigoFactura,
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-4xl! w-full! p-0 overflow-hidden"
      >
        <DialogHeader className=" p-4 ">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <CheckCircle2 className="text-emerald-400 h-5 w-5" />
            Itens do pagamento{' '}
            {selectedInvoice?.CodigoFactura
              ? `#${selectedInvoice?.CodigoFactura}`
              : ''}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Detalhes do pagamento #{selectedInvoice?.CodigoFactura}
          </DialogDescription>
        </DialogHeader>

        <Card className="p-4">
          {isLoading ? (
            <div className="flex flex-col items-center py-10 gap-2">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm text-slate-500 italic">
                Carregando itens...
              </p>
            </div>
          ) : detailsData && detailsData.length > 0 ? (
            <div className="space-y-6">
              {/* Tabela de Itens */}
              <div className="overflow-hidden">
                <div className="max-h-[400px] overflow-y-auto">
                  {' '}
                  <Table className="w-full text-left text-sm">
                    <TableHeader className="uppercase">
                      <TableRow>
                        <TableHead className="px-4 py-3">Referência</TableHead>
                        <TableHead className="px-4 py-3">Serviço</TableHead>
                        <TableHead className="px-4 py-3 text-center">
                          Qtd
                        </TableHead>
                        <TableHead className="px-4 py-3 text-right">
                          Preço Un.
                        </TableHead>
                        <TableHead className="px-4 py-3 text-right">
                          Multa
                        </TableHead>
                        <TableHead className="px-4 py-3 text-right">
                          Total
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detailsData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.REFERENCIA}</TableCell>
                          <TableCell>{item.SERVICO}</TableCell>
                          <TableCell>{item.QUANTIDADE}</TableCell>
                          <TableCell>
                            {formatCurrency(item.PRECO ?? 0)}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-right text-red-500 font-medium">
                            {formatCurrency(item.MULTA ?? 0)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(item.TOTAL ?? 0)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Card de Resumo Financeiro */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between ">
                <div className="space-y-1">
                  <p>
                    Data de Emissão :{' '}
                    <b>
                      {new Date(detailsData[0].DATAFACTURA).toLocaleDateString(
                        'pt-PT',
                      )}
                    </b>
                  </p>
                  <p>
                    {student?.enrollmentCode ? (
                      <>
                        Matrícula: <b>{student?.enrollmentCode || '---'}</b>
                      </>
                    ) : (
                      <>
                        Pré-Inscrição:{' '}
                        <b>{student?.preEnrollmentCode || '---'}</b>
                      </>
                    )}
                  </p>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Valor Total Pago
                  </span>
                  <span className="text-2xl font-black text-emerald-600">
                    {formatCurrency(
                      detailsData.reduce(
                        (acc, curr) => acc + curr.VALOR_PAGO,
                        0,
                      ),
                    )}
                  </span>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-3">
                <Button
                  onClick={async () => {
                    if (!detailsData || !selectedInvoice || !student) return
                    const blob = await pdf(
                      <DetailedInvoiceStyledPDF
                        details={detailsData}
                        student={student}
                        studentPayment={selectedInvoice}
                      />,
                    ).toBlob()
                    window.open(URL.createObjectURL(blob))
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  <Printer className="h-4 w-4 mr-2" /> IMPRIMIR RECIBO
                </Button>
                <Button className="flex-1 cursor-pointer" onClick={onClose}>
                  FECHAR
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500">
              Nenhum dado encontrado.
            </div>
          )}
        </Card>
      </DialogContent>
    </Dialog>
  )
}
