import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Calculator, CheckCircle2, FileText } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { toast } from 'sonner'

import { RenegociationSkeleton } from './components/renegociation-skeleton'
import { ProgressStep } from './components/progress-step'
import { SearchDebt } from './components/search-debt'
import { searchDebtSchema } from './schemas'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { apexApi } from '@/lib/apex-api'

const simulateNegotiationSchema = z.object({
  academicYear: z.string().min(1, 'Ano académico é obrigatório'),
  enrollmentCode: z.string().min(1, 'Código de matrícula é obrigatório'),
  totalAmount: z.number().min(0, 'Valor total deve ser maior que 0'),
  initialPayment: z
    .number()
    .min(0, 'Pagamento inicial deve ser maior ou igual a 0'),
  remainingAmount: z
    .number()
    .min(0, 'Valor restante deve ser maior ou igual a 0'),
})

type SearchDebtFormData = z.infer<typeof searchDebtSchema>
type SimulateNegotiationFormData = z.infer<typeof simulateNegotiationSchema>

interface Invoice {
  reference: string
  amount: number
}

interface DebtSearchResult {
  invoices: Invoice[]
  totalOutstandingAmount: number
}

interface SimulationResult {
  academicYear: string
  enrollmentCode: string
  totalAmount: number
  negotiationType: string
  startDate: string
  endDate: string
  initialPayment: number
  finalAmount: number
  status: string
}

interface PaymentReference {
  id: string
  referenceNumber: string
  entity: string
  startDate: string
  expirationDate: string
}

interface InvoiceItem {
  description: string
  value: number
  status: string
  references: {
    referenceNumber: string
    startDate: string
    expirationDate: string
  }[]
}

export const Renegociation = () => {
  const { profileData, isLoading } = useQueryProfile()

  const [step, setStep] = useState<
    'search' | 'simulate' | 'confirm' | 'complete'
  >('search')
  const [debtData, setDebtData] = useState<DebtSearchResult | null>(null)
  const [simulationData, setSimulationData] = useState<SimulationResult | null>(
    null,
  )
  const [paymentReferences, setPaymentReferences] = useState<
    PaymentReference[]
  >([])
  const [invoices, setInvoices] = useState<InvoiceItem[]>([])
  const [searchData, setSearchData] = useState<SearchDebtFormData | null>(null)

  const searchForm = useForm<SearchDebtFormData>({
    resolver: zodResolver(searchDebtSchema),
    defaultValues: {
      enrollmentCode: profileData?.enrollmentCode,
      academicYear: '2025-2026',
    },
  })

  const simulateForm = useForm<SimulateNegotiationFormData>({
    resolver: zodResolver(simulateNegotiationSchema),
    defaultValues: {
      academicYear: '',
      enrollmentCode: '',
      totalAmount: 0,
      initialPayment: 0,
      remainingAmount: 0,
    },
  })

  const onSearchDebt = async (data: SearchDebtFormData) => {
    try {
      const openDebit = await apexApi
        .get('v1/open-debts', { searchParams: data })
        .json<DebtSearchResult>()

      if (
        openDebit.totalOutstandingAmount === 0 ||
        openDebit.invoices.length === 0
      ) {
        toast.warning('Nenhum débito encontrado')
        return
      }

      setDebtData(openDebit)
      setSearchData(data)
      simulateForm.setValue('academicYear', data.academicYear)
      simulateForm.setValue('enrollmentCode', data.enrollmentCode)
      simulateForm.setValue('totalAmount', openDebit.totalOutstandingAmount)
      setStep('simulate')
    } catch (error) {
      console.error(error)
      toast.error(
        error instanceof Error ? error.message : 'Erro ao buscar débitos',
      )
    }
  }

  const onSimulateNegotiation = async (data: SimulateNegotiationFormData) => {
    try {
      const simulationResult = await apexApi
        .post<SimulationResult>('v1/renegotiation/simulation', { json: data })
        .json()

      setSimulationData(simulationResult)
      setStep('confirm')
      toast.success('Simulação realizada')
    } catch (error) {
      console.error(error)
      toast.error(
        error instanceof Error ? error.message : 'Erro ao simular renegociação',
      )
    }
  }

  const onConfirmNegotiation = async () => {
    if (!simulationData || !searchData) return

    try {
      const response = await apexApi
        .post<PaymentReference[]>('v1/renegotiation/confirmation', {
          json: simulationData,
          timeout: false,
        })
        .json()
      setPaymentReferences(response)
      setStep('complete')

      toast.success('Renegociação confirmada!')
    } catch (error) {
      console.error(error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Erro ao confirmar renegociação',
      )
    }
  }

  const onListInvoices = async () => {
    try {
      const response = await apexApi
        .get<InvoiceItem[]>(`v1/renegotiation/${41309}`)
        .json()
      setInvoices(response)
    } catch (error) {
      console.error(error)
      toast.error(
        error instanceof Error ? error.message : 'Erro ao listar Renegociações',
      )
    }
  }

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kz`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO')
  }

  const resetProcess = () => {
    setStep('search')
    setDebtData(null)
    setSimulationData(null)
    setPaymentReferences([])
    setSearchData(null)
    searchForm.reset()
    simulateForm.reset()
  }
  if (!profileData || isLoading) return <RenegociationSkeleton />
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Renegociação de Dívida
        </h1>
        <p className="text-muted-foreground">
          Regularize sua situação financeira com condições especiais
        </p>
      </div>

      <ProgressStep step={step} />
      {/* Step 1: Search Debt */}
      {step === 'search' && (
        <SearchDebt onSearchDebt={onSearchDebt} searchForm={searchForm} />
      )}

      {/* Step 2: Simulate Negotiation */}
      {step === 'simulate' && debtData && (
        <>
          {/* Debt Summary */}
          <Card className="border-warning">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-warning" />
                    Dívidas Encontradas
                  </CardTitle>
                  <CardDescription>
                    Faturas pendentes de pagamento
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="text-warning border-warning"
                >
                  {debtData.invoices.length} fatura(s)
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total em atraso
                  </p>
                  <p className="text-3xl font-bold text-warning">
                    {formatCurrency(debtData.totalOutstandingAmount)}
                  </p>
                </div>
                <div className="space-y-2">
                  {debtData.invoices.map((invoice) => (
                    <div
                      key={invoice.reference}
                      className="flex justify-between items-center p-3 bg-muted rounded-lg"
                    >
                      <span className="text-sm">
                        Referência: {invoice.reference}
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(invoice.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Simulation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Simular Renegociação
              </CardTitle>
              <CardDescription>
                Defina os valores para simular a renegociação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...simulateForm}>
                <form
                  onSubmit={simulateForm.handleSubmit(onSimulateNegotiation)}
                  className="space-y-4"
                >
                  <FormField
                    control={simulateForm.control}
                    name="totalAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Total</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={simulateForm.control}
                    name="initialPayment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pagamento Inicial</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ex: 30000"
                            {...field}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0
                              field.onChange(value)
                              const total =
                                simulateForm.getValues('totalAmount')
                              simulateForm.setValue(
                                'remainingAmount',
                                total - value,
                              )
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={simulateForm.control}
                    name="remainingAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Restante</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetProcess}
                      className="flex-1"
                    >
                      Voltar
                    </Button>
                    <Button type="submit" className="flex-1">
                      <Calculator className="mr-2 h-4 w-4" />
                      Simular
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </>
      )}

      {/* Step 3: Confirm Negotiation */}
      {step === 'confirm' && simulationData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Confirmar Renegociação
            </CardTitle>
            <CardDescription>
              Revise os detalhes da simulação antes de confirmar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Código de Matrícula
                </p>
                <p className="font-semibold">{simulationData.enrollmentCode}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Ano Académico</p>
                <p className="font-semibold">{simulationData.academicYear}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="font-semibold">
                  {formatCurrency(simulationData.totalAmount)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Tipo de Negociação
                </p>
                <Badge>{simulationData.negotiationType}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Data de Início</p>
                <p className="font-semibold">
                  {formatDate(simulationData.startDate)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Data de Término</p>
                <p className="font-semibold">
                  {formatDate(simulationData.endDate)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Pagamento Inicial
                </p>
                <p className="font-semibold">
                  {formatCurrency(simulationData.initialPayment)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Valor Final</p>
                <p className="font-semibold">
                  {formatCurrency(simulationData.finalAmount)}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('simulate')}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button onClick={onConfirmNegotiation} className="flex-1">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Confirmar Renegociação
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Complete */}
      {step === 'complete' && paymentReferences.length > 0 && (
        <>
          <Card className="border-success">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-5 w-5" />
                Renegociação Confirmada!
              </CardTitle>
              <CardDescription>
                Suas referências de pagamento foram geradas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentReferences.map((ref) => (
                <div key={ref.id} className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Referência
                    </span>
                    <span className="font-bold text-lg">
                      {ref.referenceNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Entidade
                    </span>
                    <span className="font-semibold">{ref.entity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Validade
                    </span>
                    <span className="font-semibold">
                      {formatDate(ref.startDate)} -{' '}
                      {formatDate(ref.expirationDate)}
                    </span>
                  </div>
                </div>
              ))}

              <Button onClick={resetProcess} className="w-full">
                Nova Renegociação
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {/* List Invoices Button */}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Minhas Faturas
          </CardTitle>
          <CardDescription>
            Visualize todas as suas faturas e referências de pagamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onListInvoices} variant="outline" className="w-full">
            <FileText className="mr-2 h-4 w-4" />
            Listar Faturas
          </Button>

          {invoices.length > 0 && (
            <div className="mt-4 space-y-3">
              {invoices.map((invoice, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{invoice.description}</p>
                      <Badge variant="secondary" className="mt-1">
                        {invoice.status}
                      </Badge>
                    </div>
                    <p className="font-bold">{formatCurrency(invoice.value)}</p>
                  </div>
                  {invoice.references.map((ref, refIndex) => (
                    <div
                      key={refIndex}
                      className="p-3 bg-muted rounded text-sm space-y-1"
                    >
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Referência:
                        </span>
                        <span className="font-mono font-semibold">
                          {ref.referenceNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Validade:</span>
                        <span>
                          {formatDate(ref.startDate)} -{' '}
                          {formatDate(ref.expirationDate)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
