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
import { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { useMutationNegotiation } from '@/hooks/renegotiation/use-query-renegotiation';
import { ApiError } from '@/error';

// === SCHEMA ===
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



export const Renegociation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate()
  const { isLoading: isLoadingProfile, profileData } = useQueryProfile();
  const { data: academicYear } = useQueryCurrentAcademicYear();
  const { createRenegotiationAsync } = useMutationNegotiation()
  const [step, setStep] = useState<'search' | 'simulate' | 'confirm' | 'complete'>('search');
  const [debtData, setDebtData] = useState<DebtNegotiationResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [simulationData, setSimulationData] = useState<SimulateNegotiationFormData | null>(null);
  console.log(academicYear)
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

  // === ATUALIZA PAGAMENTO INICIAL AO MUDAR TIPO ===
  useEffect(() => {
    const subscription = simulateForm.watch((value, { name }) => {
      if (name === 'negotiationType' && value.totalAmount != null) {
        const total = value.totalAmount as number;
        const type = value.negotiationType as 'Total' | 'Parcial' | undefined;

        if (type === 'Total') {
          simulateForm.setValue('initialPayment', total);
        } else if (type === 'Parcial') {
          simulateForm.setValue('initialPayment', Math.round(total / 2));
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [simulateForm]);

  // === LOADING ===
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

  // === SIMULAR ===
  const onSimulateNegotiation = async (data: SimulateNegotiationFormData) => {
    setSimulationData(data);
    setStep('confirm');
    toast.success('Pronto para confirmar a renegociação');
  };

  // === CONFIRMAR ===
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
        fatura_item_servicos: debtData.dividaOutrosServicos as any[],
        valor_pago_na_hora: simulationData.initialPayment,
        percentagem_retencao: debtData.percentagem_retencao,
        size: debtData.size,
        bolsa: debtData.bolsa || '',
        somaValorDividaRecurso: debtData.somaValorDividaRecurso || 0,
      };

      console.log('Payload enviado:', payload);
      await createRenegotiationAsync({
        payload,
        enrollmentCode: profileData?.codigo_matricula ?? '',
      });

      toast.success('Renegociação confirmada com sucesso!');
      setStep('complete');
    } catch (error: any) {
      console.error('Erro ao criar renegociação:', error);
      if (error instanceof ApiError) {
        // Remove as aspas quebradas que o backend manda
      //  const cleanMessage = error.message.replace(/"/g, '').trim()
       // toast.error(cleanMessage || 'Erro ao criar renegociação.')
      } else {
        toast.error('Erro de conexão. Tente novamente.')
      }
    }
  };

  // === FORMATADORES ===
  const formatCurrency = (value: number) =>
    `${value.toLocaleString('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kz`;


  // === RESET ===
  const resetProcess = () => {
    setStep('search');
    setDebtData(null);
    setSimulationData(null);

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
          {debtData.totalDivida > 0 ? (
            <>
              {/* Resumo */}
              <Card className="border-warning">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-warning" />
                        Dívidas Encontradas
                      </CardTitle>
                      <CardDescription>Faturas pendentes</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-warning border-warning">
                      {debtData.size} item(s)
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total em atraso </p>
                      <p className="text-3xl font-bold text-warning">
                        {formatCurrency(debtData.totalDivida)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Mensalidade(s)</p>

                      {debtData.mesesDividas && debtData.mesesDividas.length > 0 ? (
                        debtData.mesesDividas.map((m: any) => (
                          <div
                            key={m.codigo_propina || m.reference || m.mes_propina}
                            className="flex justify-between items-center p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                          >
                            <span className="text-sm">
                              {m.servico || 'Mensalidade'} - {m.mes_propina || 'Mês não informado'}
                            </span>
                            <span className="font-semibold text-primary">
                              {formatCurrency(m.total)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="flex justify-center items-center p-4 bg-muted/50 rounded-lg text-muted-foreground text-sm italic">
                          Sem mensalidades em dívida
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Outros Serviço(s)</p>

                      {debtData.dividaOutrosServicos && debtData.dividaOutrosServicos.length > 0 ? (
                        debtData.dividaOutrosServicos.map((m: any) => (
                          <div
                            key={m.servico}
                            className="flex justify-between items-center p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                          >
                            <span className="text-sm">
                              {m.servico}
                            </span>
                            <span className="font-semibold text-primary">
                              {formatCurrency(m.total)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="flex justify-center items-center p-4 bg-muted/50 rounded-lg text-muted-foreground text-sm italic">
                          Sem dívida em outros serviços
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Formulário */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Renegociar Dívida
                  </CardTitle>
                  <CardDescription>Escolha o tipo e ajuste o pagamento inicial</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...simulateForm}>
                    <form
                      onSubmit={simulateForm.handleSubmit(onSimulateNegotiation)}
                      className="space-y-4"
                    >
                      {/* Total */}
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

                      {/* Tipo */}
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
                                <SelectItem value="Parcial">Parcial (50% inicial)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Pagamento Inicial */}
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
            <Card className="border-success/20 bg-success/5">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-success/10 border-2 border-success/30 rounded-full p-4 mb-4">
                  <CheckCircle2 className="h-10 w-10 text-success" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Nenhuma Dívida Pendente
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mb-4">
                  Parabéns! Você está em dia com suas obrigações financeiras.
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
            <CardDescription>Revise os detalhes</CardDescription>
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
      {step === 'complete' && (
        <Card className="border-success/20 bg-success/5">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-6">
            {/* Animação de Sucesso */}
            <div className="relative">
              <div className="animate-ping absolute inline-flex h-20 w-20 rounded-full bg-success/20 opacity-75"></div>
              <div className="relative inline-flex rounded-full bg-success/10 p-4">
                <CheckCircle2 className="h-12 w-12 text-success animate-bounce" />
              </div>
            </div>

            {/* Título */}
            <div>
              <h3 className="text-2xl font-bold text-foreground">Renegociação Confirmada!</h3>
              <p className="text-muted-foreground mt-1">
                Sua renegociação foi processada com sucesso.
              </p>
            </div>

            {/* Instrução */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
              <p className="text-sm font-medium text-blue-900">
                Vá à área de <span className="font-bold">Finanças</span> para:
              </p>
              <ul className="mt-2 text-sm text-blue-800 space-y-1">
                <li>Ver a nota de pagamento</li>
                <li>Obter a referência Multicaixa</li>
                <li>Efetuar o pagamento</li>
              </ul>
            </div>

            {/* Botões */}
            <div className="flex gap-3 w-full max-w-xs">
              <Button variant="outline" onClick={resetProcess} className="flex-1">
                Nova Renegociação
              </Button>
              <Button
                className="flex-1"
                onClick={() => navigate('/financas')}

              >
                Ir para Finanças
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};