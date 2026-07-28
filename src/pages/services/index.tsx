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
  Search,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  MapPin,
  PackageOpen,
  Minus,
  Plus,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
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
import type { ServiceItem } from '@/services/academicService/academic-service.service'

const PAGE_LIMIT = 10

export function AcademicServices() {
  const navigate = useNavigate()
  const [selectedServices, setSelectedServices] = useState<Record<string, number>>({})
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  // === Busca com debounce ===
  const [searchInput, setSearchInput] = useState('')
  const [searchService, setSearchService] = useState<string | undefined>(
    undefined,
  )
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchService(searchInput.trim() || undefined)
      setPage(1)
    }, 400)
    return () => clearTimeout(timeout)
  }, [searchInput])

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
    codigoAnoLectivo: academicYearData?.codigo,
    descricao: searchService,
    estado: 'Ativo',
    visualizarNoPortal: 'SIM',
    tipoCandidatura: profileData?.codigo_tipo_candidatura,
    page,
    limit: PAGE_LIMIT,
  })

  const { createInvoiceAsync, createInvoicePending } =
    useMutationCreateInvoice()

  const poloId = profileData?.poloid ?? '1'
  const enrollmentCode = profileData?.codigo_matricula
  const pre_inscricao_raw = profileData?.codigo_preinscricao

  const matriculaNumero = enrollmentCode ? enrollmentCode : null
  const preInscricaoNumero = pre_inscricao_raw ? pre_inscricao_raw : null

  const services = servicesData?.data ?? []
  const total = servicesData?.total ?? 0
  const lastPage = servicesData?.lastPage ?? 1

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
  const payload: CreateInvoiceBody | any =
    useMemo<CreateInvoiceBody | any>(() => {
      if (
        !servicesData?.data ||
        !academicYearData?.codigo ||
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

      const itens = servicesData.data
        .filter((s: ServiceItem) => selectedServices[String(s.codigo)])
        .map((service: ServiceItem) => {
          const quantidade = selectedServices[String(service.codigo)] || 1
          const preco = Number(service.preco)
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
            codigo_anoLectivo: Number(academicYearData?.codigo),
          }
        })

      const TotalPreco = itens.reduce(
        (sum: number, i: any) => sum + i.Total,
        0,
      )
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
        codigo_anoLectivo: Number(academicYearData?.codigo),
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
  const selectedCount = Object.keys(selectedServices).length

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

  // === Estados de Loading / Erro ===
  if (loadingProfile || loadingServices) return <ServicesSkeleton />
  if (errorProfile || errorServices || !servicesData)
    return (
      <ErrorState message="Não foi possível carregar os serviços. Tente novamente mais tarde." />
    )

  return (
    <>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">
            Serviços Acadêmicos
          </h1>
          <p className="text-muted-foreground">
            Selecione os serviços desejados e ajuste a quantidade antes de
            gerar a fatura.
          </p>
        </header>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Serviços Disponíveis
                </CardTitle>
                <CardDescription>
                  {total > 0
                    ? `${total} serviço(s) encontrado(s)`
                    : 'Marque os itens que deseja faturar.'}
                </CardDescription>
              </div>
              <div className="relative sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="servico"
                  placeholder="Pesquisar por serviço..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {services.length === 0 ? (
              <EmptyState searching={!!searchService} />
            ) : (
              <div className="space-y-3">
                {services.map((service) => (
                  <ServiceItemRow
                    key={service.codigo}
                    service={service}
                    quantidade={selectedServices[String(service.codigo)] ?? 0}
                    onChange={handleServiceChange}
                  />
                ))}
              </div>
            )}

            {/* === PAGINAÇÃO === */}
            {services.length > 0 && lastPage > 1 && (
              <div className="mt-6 flex items-center justify-between border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  Página {page} de {lastPage}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= lastPage}
                    onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* === RESUMO / CHECKOUT === */}
            {selectedCount > 0 && payload && (
              <div className="mt-8 pt-6 border-t">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                  className="w-full mt-4"
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
  const preco = Number(service.preco)
  const codigo = String(service.codigo)
  const isSelected = quantidade > 0

  return (
    <div
      className={`flex flex-col gap-4 rounded-lg border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between ${
        isSelected ? 'border-primary/50 bg-primary/5' : 'hover:bg-accent/50'
      }`}
    >
      <div className="flex items-start gap-4">
        <Checkbox
          id={codigo}
          checked={isSelected}
          onCheckedChange={(checked) => onChange(codigo, checked ? 1 : 0)}
          className="mt-1"
        />
        <label htmlFor={codigo} className="cursor-pointer space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium leading-tight">
              {service.descricao}
            </span>
            <Badge variant="outline">{service.tiposervico}</Badge>
            {service.mestrado === 'SIM' && (
              <Badge variant="secondary" className="gap-1">
                <GraduationCap className="h-3 w-3" />
                Mestrado
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        
      
            {service.polo && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {service.polo}
              </span>
            )}
          </div>
        </label>
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-normal">
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Preço unitário</p>
          <p className="font-semibold">
            {preco.toLocaleString('pt-AO', {
              style: 'currency',
              currency: 'AOA',
            })}
          </p>
        </div>

        {isSelected && (
          <div className="flex items-center gap-1 rounded-md border">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onChange(codigo, Math.max(1, quantidade - 1))}
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <input
              type="number"
              min={1}
              value={quantidade}
              onChange={(e) =>
                onChange(codigo, Math.max(1, parseInt(e.target.value, 10) || 1))
              }
              className="w-10 border-x bg-transparent p-1 text-center text-sm outline-none"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onChange(codigo, quantidade + 1)}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
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

function EmptyState({ searching }: { searching?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-12 text-center">
      <PackageOpen className="h-10 w-10 text-muted-foreground" />
      <div>
        <p className="font-medium">
          {searching
            ? 'Nenhum serviço encontrado para essa busca'
            : 'Nenhum serviço disponível no momento'}
        </p>
        <p className="text-sm text-muted-foreground">
          {searching
            ? 'Tente pesquisar por outro termo.'
            : 'Volte mais tarde para conferir novos serviços.'}
        </p>
      </div>
    </div>
  )
}