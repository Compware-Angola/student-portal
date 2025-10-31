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
  const { data: availableServices, isLoading, isError } = useQueryAvailableServices({ academicYear, poloId });


  const handleServiceToggle = (codigo: string) => {
    setSelectedServices((prev) =>
      prev.includes(codigo)
        ? prev.filter((c) => c !== codigo)
        : [...prev, codigo],
    )
  }

  const handleProceedToPayment = () => {
      console.log("Serviços selecionados para pagamento:", selectedServices);
    
      alert(`Prosseguir com o pagamento de ${totalCost.toLocaleString()} Kz`);
  }

  // CÁLCULO DO CUSTO TOTAL (USANDO useMemo)
  const totalCost = useMemo(() => {
    if (!availableServices) return 0;
    
    return availableServices.servicos.reduce((total, service) => {

      if (selectedServices.includes(service.codigo)) {
      
        return total + parseFloat(service.preco);
      }
      return total;
    }, 0);
  }, [selectedServices, availableServices]);
  
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Serviços Acadêmicos
        </h1>
        <p className="text-muted-foreground mt-2">
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
                    {selectedServices.length} serviço(s) selecionado(s)
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total a pagar</p>
                  <p className="text-2xl font-bold text-primary">
                    {totalCost.toLocaleString()} Kz
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