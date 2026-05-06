/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useNavigate } from 'react-router-dom'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useQueryAvailableServices } from '@/hooks/service/use-query-available-services'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useMutationCreateInvoice } from '@/hooks/invoice/use-mutation-create-invoice'
import { useQueryCurrentAcademicYear } from '@/hooks/academic-year/use-query-current-academic-year'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { CreateInvoiceBody } from '@/services/invoice/post-invoice.service'

interface ServiceItem {
  codigo: string
  descricao: string
  preco: string
  tipo_servico: string
}

export function AcademicServices() {
  // === Estado de serviços selecionados com quantidade ===
  const navigate = useNavigate()
  const [selectedServices, setSelectedServices] = useState<
    Record<string, number>
  >({})
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [searchService, setSearchService] = useState<string | undefined>(
    undefined,
  )

  const { data: academicYearData } = useQueryCurrentAcademicYear()
  const {
    profileData,
    isLoading: loadingProfile,
    isError: errorProfile,
  } = useQueryProfile()
  const {
    data: servicesData,
    isLoading: loadingServices,
    isError: errorServices,
  } = useQueryAvailableServices({
    academicYear: academicYearData?.codigo,
    poloId: profileData?.poloid.toString() ?? '1',
  })

  const { createInvoiceAsync, createInvoicePending } =
    useMutationCreateInvoice()

  const poloId = profileData?.poloid ?? '1'
  const enrollmentCode = profileData?.codigo_matricula
  const pre_inscricao_raw = profileData?.codigo_preinscricao

  const matriculaNumero = enrollmentCode ? enrollmentCode : null
  const preInscricaoNumero = pre_inscricao_raw ? pre_inscricao_raw : null

  // === Função para alterar quantidade de cada serviço ===
  const handleServiceChange = (codigo: string, quantidade: number) => {
    setSelectedServices((prev) => {
      if (quantidade <= 0) {
        const copy = { ...prev }
        delete copy[codigo]
        return copy
      }
      return { ...prev, [codigo]: quantidade }
    })
  }

  // === Payload para criar fatura ===
  const payload: CreateInvoiceBody | null =
    useMemo<CreateInvoiceBody | null>(() => {
      if (
        !servicesData?.servicos ||
        Object.keys(selectedServices).length === 0 ||
        !enrollmentCode ||
        !pre_inscricao_raw ||
        isNaN(matriculaNumero!) ||
        isNaN(preInscricaoNumero!)
      ) {
        return null
      }

      const TAXA_IVA = 0
      const TAXA_RETENCAO = 0
      const DESCONTO_PORCENTAGEM = 0
      const MAX_OBS_LENGTH = 45

      const itens = servicesData.servicos
        .filter((s: ServiceItem) => selectedServices[s.codigo])
        .map((service: ServiceItem) => {
          const quantidade = selectedServices[service.codigo] || 1
          const preco = parseFloat(service.preco)
          const totalBruto = preco * quantidade
          const valorDesconto = (totalBruto * DESCONTO_PORCENTAGEM) / 100
          const baseIncidencia = totalBruto - valorDesconto
          const valorIva = (baseIncidencia * TAXA_IVA) / 100
          const total = baseIncidencia + valorIva

          const obs =
            service.descricao.length > MAX_OBS_LENGTH
              ? service.descricao.substring(0, MAX_OBS_LENGTH)
              : service.descricao

          return {
            CodigoProduto: Number(service.codigo),
            Quantidade: quantidade,
            preco,
            Total: total,
            valor_pago: total,
            obs,
            taxaIva: TAXA_IVA,
            valorIva,
            retencao: TAXA_RETENCAO,
            incidencia: baseIncidencia,
            valorDesconto,
            descontoProduto: DESCONTO_PORCENTAGEM,
            mes: '',
            multa: 0,
            estado: 0,
            valorPago: 0,
            valorATransportar: 0,
          }
        })

      const TotalPreco = itens.reduce((sum: number, i: any) => sum + i.Total, 0)
      const totalIVA = itens.reduce(
        (sum: number, i: any) => sum + i.valorIva,
        0,
      )
      const total_retencao = itens.reduce(
        (sum: number, i: any) => sum + i.retencao,
        0,
      )
      const total_incidencia = itens.reduce(
        (sum: number, i: any) => sum + i.incidencia,
        0,
      )
      const Desconto = itens.reduce(
        (sum: number, i: any) => sum + i.valorDesconto,
        0,
      )
      const ValorAPagar = TotalPreco - total_retencao

      return {
        DataFactura: new Date().toISOString(),
        polo_id: Number(poloId),
        TotalPreco,
        codigo_descricao: 101,
        ValorAPagar,
        total_incidencia,
        total_retencao,
        CodigoMatricula: matriculaNumero!,
        codigo_preinscricao: preInscricaoNumero!,
        Desconto,
        totalIVA,
        TotalMulta: 0,
        Descricao: 'Serviços Acadêmicos',
        tipo_documento_factura_id: 1,
        canal: 3,
        itens,
      }
    }, [
      selectedServices,
      servicesData,
      poloId,
      enrollmentCode,
      pre_inscricao_raw,
      matriculaNumero,
      preInscricaoNumero,
    ])

  const totalCost = payload?.TotalPreco || 0

  const handleGenerateInvoice = async () => {
    if (!payload) {
      alert('Selecione pelo menos um serviço e verifique os dados do perfil.')
      return
    }

    try {
      await createInvoiceAsync(payload)
      setShowSuccessDialog(true)
    } catch (error) {
      console.error('Erro ao gerar fatura:', error)
      alert('Erro ao gerar a fatura. Tente novamente.')
    }
  }

  // === Filtros de busca ===
  const filteredServices = useMemo(() => {
    if (!servicesData?.servicos) return []
    if (!searchService || searchService.trim() === '') {
      return servicesData.servicos
    }
    const query = searchService.toLowerCase()
    return servicesData.servicos.filter((service: ServiceItem) =>
      service.descricao.toLowerCase().includes(query),
    )
  }, [servicesData, searchService])

  // === Estados de Loading / Erro ===
  if (loadingProfile || loadingServices) return <ServicesSkeleton />
  if (errorProfile || errorServices || !servicesData)
    return (
      <ErrorState message="Não foi possível carregar os serviços. Tente novamente mais tarde." />
    )
  if (servicesData.servicos.length === 0) return <EmptyState />

  // === Renderização Principal ===
  return (
    <>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">
            Serviços Acadêmicos
          </h1>
          <p className="text-muted-foreground">
            Selecione os serviços e ajuste a quantidade desejada.
          </p>
        </header>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Serviços Disponíveis
                </CardTitle>
                <CardDescription>
                  Marque os itens que deseja faturar.
                </CardDescription>
              </div>
              <div>
                <Input
                  id="servico"
                  placeholder="Pesquisar por Serviço"
                  value={searchService}
                  onChange={(e) => setSearchService(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {filteredServices.map((service) => (
                <ServiceItemRow
                  key={service.codigo}
                  service={service}
                  quantidade={selectedServices[service.codigo] ?? 0}
                  onChange={handleServiceChange}
                />
              ))}
            </div>

            {Object.keys(selectedServices).length > 0 && payload && (
              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="font-medium">
                      {payload.itens.length} serviço(s) selecionado(s)
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Total a pagar
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {totalCost.toLocaleString('pt-AO', {
                        style: 'currency',
                        currency: 'AOA',
                      })}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleGenerateInvoice}
                  size="lg"
                  className="w-full"
                  disabled={createInvoicePending}
                >
                  {createInvoicePending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processando...
                    </span>
                  ) : (
                    'Solicitar serviço(s)'
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* === POPUP DE SUCESSO === */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
              Solicitação feita com sucesso!
            </DialogTitle>
            <DialogDescription className="pt-2">
              Acesse a{' '}
              <span className="font-semibold text-primary">
                área financeira
              </span>{' '}
              para liquidar a nota de pagamento.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowSuccessDialog(false)}
            >
              Fechar
            </Button>
            <Button
              onClick={() => {
                const payload = {
                  tab: 'nota-pagamento',
                  from: 'servicos',
                  ts: Date.now(),
                }

                const encoded = btoa(JSON.stringify(payload))

                navigate(`/financas?data=${encoded}`)
              }}
              className="gap-2"
            >
              Ir para Financeiro
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// === COMPONENTE SERVICE ITEM ROW COM QUANTIDADE ===
function ServiceItemRow({
  service,
  quantidade,
  onChange,
}: {
  service: ServiceItem
  quantidade: number
  onChange: (codigo: string, quantidade: number) => void
}) {
  const preco = parseFloat(service.preco)

  return (
    <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-4">
        <Checkbox
          id={service.codigo}
          checked={quantidade > 0}
          onCheckedChange={(checked) =>
            onChange(service.codigo, checked ? 1 : 0)
          }
        />
        <label htmlFor={service.codigo} className="cursor-pointer space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{service.descricao}</span>
            <Badge variant="outline">{service.tipo_servico}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Código: {service.codigo}
          </p>
        </label>
      </div>

      <div className="flex flex-col items-end gap-1">
        <p className="text-sm text-muted-foreground">Preço</p>
        <p className="font-medium">
          {preco.toLocaleString('pt-AO', {
            style: 'currency',
            currency: 'AOA',
          })}
        </p>
        {quantidade > 0 && (
          <input
            type="number"
            min={1}
            value={quantidade}
            onChange={(e) =>
              onChange(service.codigo, parseInt(e.target.value, 10))
            }
            className="w-16 border rounded p-1 text-sm mt-1"
          />
        )}
      </div>
    </div>
  )
}

// === COMPONENTES AUXILIARES ===
function ServicesSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-5 w-5 rounded" />
                <div>
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-3 w-24 mt-1" />
                </div>
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erro</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

function EmptyState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços Acadêmicos</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Nenhum serviço disponível no momento.
        </p>
      </CardContent>
    </Card>
  )
}
