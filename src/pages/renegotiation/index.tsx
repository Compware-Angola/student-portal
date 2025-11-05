'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  Calculator,
  CheckCircle2,

  Mail,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { RenegociationSkeleton } from './components/renegociation-skeleton';
import { ProgressStep } from './components/progress-step';
import { SearchDebt } from './components/search-debt';
import { searchDebtSchema } from './schemas';
import { useQueryProfile } from '@/hooks/profile/use-query-profile';
import { useQueryClient } from '@tanstack/react-query';
import {
  getDebit,
  type DebtNegotiationResponse,
} from '@/services/renegotiation/renegotiation.service';
import { useQueryCurrentAcademicYear } from '@/hooks/academic-year/use-query-current-academic-year';

// === SCHEMA COM TIPO DE RENEGOCIAÇÃO ===
const simulateNegotiationSchema = z.object({
  academicYear: z.string().min(1, 'Ano académico é obrigatório'),
  enrollmentCode: z.string().min(1, 'Código de matrícula é obrigatório'),
  totalAmount: z.number().min(0, 'Valor total é obrigatório'),
  initialPayment: z.number().min(0, 'Pagamento inicial obrigatório'),
  negotiationType: z
    .enum(['Total', 'Parcial'])
    .refine((val) => val != null, {
      message: 'Selecione o tipo de renegociação',
    }),
});

type SearchDebtFormData = z.infer<typeof searchDebtSchema>;
type SimulateNegotiationFormData = z.infer<typeof simulateNegotiationSchema>;

interface PaymentReference {
  id: string;
  referenceNumber: string;
  entity: string;
  startDate: string;
  expirationDate: string;
}

export const Renegociation = () => {
  const queryClient = useQueryClient();
  const { isLoading: isLoadingProfile, profileData } = useQueryProfile();
  const { data: academicYear } = useQueryCurrentAcademicYear();

  const [step, setStep] = useState<'search' | 'simulate' | 'confirm' | 'complete'>('search');
  const [debtData, setDebtData] = useState<DebtNegotiationResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [simulationData, setSimulationData] = useState<SimulateNegotiationFormData | null>(null);
  const [paymentReferences, setPaymentReferences] = useState<PaymentReference[]>([]);

  const searchForm = useForm<SearchDebtFormData>({
    resolver: zodResolver(searchDebtSchema),
    defaultValues: {
      enrollmentCode: profileData?.codigo_matricula ?? '',
      academicYear: academicYear?.designacao ?? '',
    },
  });

  const simulateForm = useForm<SimulateNegotiationFormData>({
    resolver: zodResolver(simulateNegotiationSchema),
    defaultValues: {
      academicYear: '',
      enrollmentCode: '',
      totalAmount: 0,
      initialPayment: 0,
      negotiationType: undefined,
    },
  });

  // === LOADING SKELETON ===
  if (isLoadingProfile || !profileData) {
    return <RenegociationSkeleton />;
  }

  // === BUSCAR DÉBITO ===
  const onSearchDebt = async (data: SearchDebtFormData) => {
    setIsSearching(true);
    try {
      const result = await queryClient.fetchQuery<DebtNegotiationResponse>({
        queryKey: ['renegotiation-debit', data.enrollmentCode],
        queryFn: () =>
          getDebit({
            enrollmentCode: data.enrollmentCode,
            preinscricao: profileData?.codigo_preinscricao,
            type: '1',
          }),
      });

      setDebtData(result);
      simulateForm.setValue('academicYear', data.academicYear);
      simulateForm.setValue('enrollmentCode', data.enrollmentCode);
      simulateForm.setValue('totalAmount', result.totalDivida);
      setStep('simulate');

    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 404) {
        toast.error('Nenhuma dívida encontrada para esta matrícula.');
      } else {
        toast.error('Erro ao buscar débitos. Tente novamente.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  // === SIMULAR (avança para confirmação) ===
  const onSimulateNegotiation = async (data: SimulateNegotiationFormData) => {
    setSimulationData(data);
    setStep('confirm');
    toast.success('Pronto para confirmar a renegociação');
  };

  // === CONFIRMAR RENEGOCIAÇÃO (payload real) ===
  const onConfirmNegotiation = async () => {
    if (!debtData || !simulationData) return;

    try {
      const payload = {
        totalDivida: debtData.totalDivida,
        desconto: debtData.desconto,
        precoTotal: debtData.precoTotal,
        total_retencao: debtData.total_retencao,
        total_incidencia: debtData.total_incidencia,
        totalIVA: debtData.totalIVA,
        saldo_reset: debtData.saldo_reset,
        tipoPagamento: simulationData.negotiationType.toUpperCase() as 'TOTAL' | 'PARCIAL',
        fatura_item_mensalidades: debtData.mesesDividas.map((m: any) => ({
          codGradeCurricular: m.codGradeCurricular || '',
          codFacturaOutrosServicos: m.codFacturaOutrosServicos || '',
          bolsa: m.bolsa || '',
          mes_temp_id: m.mes_temp_id || 0,
          n_prestacao: m.n_prestacao || 0,
          valor: String(m.valor) || '0',
          multa: m.multa || 0,
          total: m.total || 0,
          servico: m.servico || '',
          mes_propina: m.mes_propina || '',
          ano_lectivo: m.ano_lectivo || '',
          taxa_multa: m.taxa_multa || 0,
          taxa_desconto: m.taxa_desconto || 0,
          codigo_propina: m.codigo_propina || 0,
          codigo_anoLectivo: m.codigo_anoLectivo || 0,
          desconto: m.desconto || 0,
          incidencia: m.incidencia || 0,
          valor_iva: m.valor_iva || 0,
          tipo_taxas: m.tipo_taxas || 0,
          taxa_descricao: m.taxa_descricao || '',
        })),
        fatura_item_servicos: debtData.dividaRecurso as any[],
        valor_pago_na_hora: simulationData.initialPayment,
        percentagem_retencao: debtData.percentagem_retencao,
        size: debtData.size,
        bolsa: debtData.bolsa || '',
        somaValorDividaRecurso: debtData.somaValorDividaRecurso || 0,
      };

      // === AQUI VOCÊ VAI CHAMAR O apexApi.post() ===
      // const response = await apexApi.post('/v1/renegotiation/confirmation', { json: payload }).json();
      // setPaymentReferences(response);

      // MOCK TEMPORÁRIO
      console.log('Payload enviado:', payload);
      toast.success('Renegociação confirmada com sucesso!');
      setStep('complete');
    } catch (error: any) {
      console.error('Erro ao confirmar:', error);
      toast.error(error.response?.data?.message || 'Erro ao confirmar renegociação');
    }
  };

  // === FORMATADORES ===
  const formatCurrency = (value: number) =>
    `${value.toLocaleString('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kz`;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('pt-AO');

  // === RESETAR FLUXO ===
  const resetProcess = () => {
    setStep('search');
    setDebtData(null);
    setSimulationData(null);
    setPaymentReferences([]);
    searchForm.reset();
    simulateForm.reset();
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Renegociação de Dívida</h1>
        <p className="text-muted-foreground">
          Regularize sua situação financeira com condições especiais
        </p>
      </div>

      <ProgressStep step={step} />

      {/* PASSO 1: BUSCAR */}
      {step === 'search' && (
        <SearchDebt
          onSearchDebt={onSearchDebt}
          searchForm={searchForm}
          isSearching={isSearching}
        />
      )}

      {/* PASSO 2: SIMULAR */}
      {step === 'simulate' && debtData && (
        <>
          {/* Resumo da Dívida */}
          {debtData.totalDivida > 0 ? (
            <>
              <Card className="border-warning">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-warning" />
                        Dívidas Encontradas
                      </CardTitle>
                      <CardDescription>Faturas pendentes de pagamento</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-warning border-warning">
                      {debtData.size} Quantidade(s)
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total em atraso</p>
                      <p className="text-3xl font-bold text-warning">
                        {formatCurrency(debtData.totalDivida)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {debtData.mesesDividas.map((m: any) => (
                        <div
                          key={m.codigo_propina || m.reference}
                          className="flex justify-between items-center p-3 bg-muted rounded-lg"
                        >
                          <span className="text-sm">{m.servico} - {m.mes_propina}</span>
                          <span className="font-semibold">{formatCurrency(m.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Formulário de Simulação */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Renegociar Dívida
                  </CardTitle>
                  <CardDescription>Escolha o tipo e defina o pagamento inicial</CardDescription>
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
                              <Input type="number" {...field} disabled />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={simulateForm.control}
                        name="negotiationType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Renegociação</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Total">Total (pagar tudo)</SelectItem>
                                <SelectItem value="Parcial">Parcial (em prestações)</SelectItem>
                              </SelectContent>
                            </Select>
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
                                  const value = parseFloat(e.target.value) || 0;
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={resetProcess} className="flex-1">
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
          ) : (
            /* CARD VAZIO – MELHORADO */
            <Card className="border-success/20 bg-success/5">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-success/10 border-2 border-success/30 rounded-full p-4 mb-4">
                  <CheckCircle2 className="h-10 w-10 text-success" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Nenhuma Dívida Pendente
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mb-4">
                  Parabéns! Você está em dia com suas obrigações financeiras. Não há dívidas para renegociar no momento.
                </p>
                <Button variant="outline" size="sm" onClick={resetProcess}>
                  <Mail className="mr-2 h-4 w-4" />
                  Contato com Secretaria
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* PASSO 3: CONFIRMAR */}
      {step === 'confirm' && simulationData && debtData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Confirmar Renegociação
            </CardTitle>
            <CardDescription>Revise os detalhes antes de confirmar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Matrícula</p>
                <p className="font-semibold">{simulationData.enrollmentCode}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Ano Académico</p>
                <p className="font-semibold">{simulationData.academicYear}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="font-semibold">{formatCurrency(simulationData.totalAmount)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tipo</p>
                <Badge>{simulationData.negotiationType}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Pagamento Inicial</p>
                <p className="font-semibold">{formatCurrency(simulationData.initialPayment)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Valor Restante</p>
                <p className="font-semibold">
                  {formatCurrency(simulationData.totalAmount - simulationData.initialPayment)}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep('simulate')} className="flex-1">
                Voltar
              </Button>
              <Button onClick={onConfirmNegotiation} className="flex-1">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Confirmar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PASSO 4: COMPLETO */}
      {step === 'complete' && paymentReferences.length > 0 && (
        <Card className="border-success">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-5 w-5" />
              Renegociação Confirmada!
            </CardTitle>
            <CardDescription>Suas referências de pagamento foram geradas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentReferences.map((ref) => (
              <div key={ref.id} className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Referência</span>
                  <span className="font-bold text-lg">{ref.referenceNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Entidade</span>
                  <span className="font-semibold">{ref.entity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Validade</span>
                  <span className="font-semibold">
                    {formatDate(ref.startDate)} - {formatDate(ref.expirationDate)}
                  </span>
                </div>
              </div>
            ))}
            <Button onClick={resetProcess} className="w-full">
              Nova Renegociação
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};