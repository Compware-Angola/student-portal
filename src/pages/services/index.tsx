import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { useState, useMemo } from 'react'
import { BookOpen, DollarSign, CheckCircle2 } from 'lucide-react'
import { useQueryAvailableServices } from '@/hooks/service/use-query-available-services'


export function AcademicServices() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]) 

  const  academicYear = "23"
  const  poloId = "1"
  // Dados reais serão carregados por este hook:
  const { data: availableServices, isLoading, isError } = useQueryAvailableServices({ academicYear, poloId });


  const handleServiceToggle = (codigo: string) => {
    setSelectedServices((prev) =>
      prev.includes(codigo)
        ? prev.filter((c) => c !== codigo)
        : [...prev, codigo],
    )
  }

  // --- CÁLCULO E ESTRUTURAÇÃO DO OBJETO FINAL (NOVA LÓGICA) ---
  const paymentDetails = useMemo(() => {
    // Verifica se os dados estão disponíveis e se 'servicos' é um array
    if (!availableServices || !Array.isArray(availableServices.servicos)) {
      return { total: 0, servicos: [] };
    }
    
    // 1. Filtra e mapeia os serviços selecionados para o formato final
    const servicosSelecionadosFormatados = availableServices.servicos
      .filter((service: any) => selectedServices.includes(service.codigo))
      .map((service: any) => ({
        id: service.codigo, // id do serviço
        descricao: service.descricao,
        // Garante que o preço seja um número para o cálculo
        preco: parseFloat(service.preco), 
      }));

    // 2. Calcula o total
    const custoTotal = servicosSelecionadosFormatados.reduce(
      (total, service) => total + service.preco,
      0,
    );
    
    // 3. Retorna o objeto estruturado: { total, servicos: [...] }
    return {
      total: custoTotal,
      servicos: servicosSelecionadosFormatados,
    };
  }, [selectedServices, availableServices]);
  
  // Extrai o total para uso na UI
  const totalCost = paymentDetails.total;


  const handleProceedToPayment = () => {
      if (paymentDetails.servicos.length === 0) {
          // Aqui, você pode usar um modal ou notificação em vez de alert
          console.error("Nenhum serviço selecionado.");
          return;
      }
      
      // ESTE É O OBJETO FINAL NO FORMATO SOLICITADO
      const finalPayload = {
          total: paymentDetails.total,
          servicos: paymentDetails.servicos,
      };

      console.log("Payload Final para Pagamento:", finalPayload);
    
      // Em uma aplicação real, aqui você faria a chamada API para gerar a referência:
      // api.post('/api/finance/gerar-referencia-agrupada', finalPayload);
      
      alert(`Ação: Chamada API para gerar Referência Bancária única. Total: ${finalPayload.total.toLocaleString('pt-PT', { style: 'currency', currency: 'AOA', minimumFractionDigits: 0 })}. Verifique o console para o objeto final.`);
  }

  // --- Estados de Carregamento e Erro ---
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Serviços Acadêmicos</CardTitle>
        </CardHeader>
        <CardContent>A carregar Serviços...</CardContent>
      </Card>
    )
  }

  if (isError || !availableServices) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro</CardTitle>
        </CardHeader>
        <CardContent>
          Não foi possível carregar os dados dos serviços.
        </CardContent>
      </Card>
    )
  }

  if (availableServices.servicos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Serviços Acadêmicos</CardTitle>
        </CardHeader>
        <CardContent>Nenhum serviço disponível no momento.</CardContent>
      </Card>
    )
  }


  // --- Renderização Principal ---
  return (
    <>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Serviços Acadêmicos
        </h1>
        <p className="text-muted-foreground">
          Solicite serviços acadêmicos disponíveis para pagamento.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Serviços Disponíveis
          </CardTitle>
          <CardDescription>
            Selecione os serviços que deseja pagar ou solicitar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableServices.servicos 
              .map((service:any) => (
              <div
                key={service.codigo}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    id={service.codigo}
                    checked={selectedServices.includes(service.codigo)}
                    onCheckedChange={() => handleServiceToggle(service.codigo)}
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={service.codigo}
                        className="font-medium cursor-pointer"
                      >
                        {service.descricao} 
                      </label>
                      <Badge variant="outline">{service.tipo_servico}</Badge> 
                    </div>
                    <p className="text-sm text-muted-foreground">
                       Código: {service.codigo}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Custo</p>
                    <p className="text-sm font-medium">
                      {parseFloat(service.preco).toLocaleString()} Kz
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedServices.length > 0 && (
            <div className="mt-6 pt-6 border-t space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    {paymentDetails.servicos.length} serviço(s) selecionado(s)
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total a pagar</p>
                  <p className="text-2xl font-bold text-primary">
                    {/* Usando formatação de moeda para AOA (Kwanzas) */}
                    {totalCost.toLocaleString('pt-PT', { style: 'currency', currency: 'AOA', minimumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleProceedToPayment}
                className="w-full"
                size="lg"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Proceder ao Pagamento
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
