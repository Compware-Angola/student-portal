import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, Eye, Calendar } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useQueryPayments } from '@/hooks/finance/use-query-finance-payments'
import { Loader2 } from 'lucide-react'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useEffect, useState } from 'react'
import { useQueryAcademicYearStudent } from '@/hooks/academic-year/use-query-academic-year-student'
import { dedupeAcademicYears } from '../finance'
import { YearSelect } from '@/components/year-select'
import ComprovantePagamento from '@/components/comprovante-pagamento'

interface NotaPagamento {
  id: string
  numero: string
  tipo: 'Mesalidade' | 'servico' | 'melhoria' | 'inscricao' | string
  descricao: string
  valor: number
  dataEmissao: string
  dataVencimento: string
  dataFactura: string
  status: 'concluido' | 'pendente' | 'vencida' | string
  metodoPagamento?:
    | 'cash'
    | 'transferencia'
    | 'muteu_cash'
    | 'deposito'
    | 'express'
    | 'por_referencia'
    | 'tpa'
    | string
  comprovante?: string
}

const mapApiToNotaPagamento = (apiData: any[]): NotaPagamento[] => {
  return apiData.map((item: any) => {
    let status: 'concluido' | 'pendente' | 'vencida' | string
    const isPaid = item.p_status_pagamento === 'concluido'
    const isExpired =
      item.f_DataVencimento &&
      new Date(item.f_DataVencimento) < new Date() &&
      !isPaid

    if (isPaid) {
      status = 'concluido'
    } else if (isExpired) {
      status = 'vencida'
    } else {
      status = 'pendente'
    }

    // Simples regra de tipo
    let tipo: string = 'servico'
    if (
      item.Descricao_produto &&
      item.Descricao_produto.toLowerCase().includes('Mensalidade')
    ) {
      tipo = 'Mensalidade'
    }
    return {
      id: String(item.CodigoPagamento || item.CodigoFactura),
      numero: item.f_Referencia || `FAT-${item.CodigoFactura}`,
      tipo: tipo,

      descricao:
        [item.Descricao_produto, item.Descricao_factura]
          .map((v) => (v ?? '').toString().trim())
          .find((s) => s && !['', 'None', 'null'].includes(s)) ||
        'Servço/Pagamentos',

      valor: Number(item.f_ValorAPagar) || Number(item.TotalItem) || 0,
      dataEmissao: item.f_DataFactura,
      dataVencimento: item.f_DataVencimento,
      status: status,
      dataFactura: item.f_DataFactura,
      metodoPagamento: item.p_forma_pagamento
        ? item.p_forma_pagamento.replace(/\s/g, '_').toLowerCase()
        : undefined,
      comprovante: undefined,
    }
  })
}

export const NotaPagamento = () => {
  const { profileData } = useQueryProfile()

  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    undefined,
  )

  const {
    data: pagamentosData,
    isLoading,
    isError,
  } = useQueryPayments({
    academicYear: selectedYear,
    preRegistrationCode: profileData?.codigo_preinscricao,

    page: 1,
    limit: 10,
  })
  // Mapear dados da API para o formato do componente
  const notas: NotaPagamento[] = pagamentosData?.data
    ? mapApiToNotaPagamento(pagamentosData.data)
    : []

  const { data: academicYearData } = useQueryAcademicYearStudent(
    profileData?.enrollmentCode,
  )
  const academicYears = dedupeAcademicYears(academicYearData?.anolectivos)
  useEffect(() => {
    if (!academicYears) return

    // Encontrar o ano ativo
    const active = academicYears.find((y) => y.estado === 'Activo')

    if (active && !selectedYear) {
      setSelectedYear(String(active.codigo))
    }
  }, [academicYears, selectedYear, setSelectedYear])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'concluido':
        return <Badge variant="secondary">Paga</Badge>
      case 'pendente':
        return <Badge variant="default">Pendente</Badge>
      case 'vencida':
        return <Badge variant="destructive">Vencida</Badge>
      default:
        return <Badge>Desconhecido</Badge>
    }
  }

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'Mensalidade':
        return <Badge variant="outline">Mensalidade</Badge>
      case 'servico':
        return <Badge variant="outline">Serviço</Badge>
      case 'melhoria':
        return <Badge variant="outline">Melhoria</Badge>
      case 'inscricao':
        return <Badge variant="outline">Inscrição</Badge>
      default:
        return <Badge variant="outline">Outro</Badge>
    }
  }

  const getMetodoPagamento = (metodo?: string) => {
    if (!metodo) return 'n/a'
    switch (metodo.trim()) {
      case 'TPA':
        return 'tpa'
      case 'DEPOSITO':
        return 'deposito'
      case 'TRANSFERENCIA':
        return 'transferencia'
      case 'EXPRESS':
        return 'express'
      case 'POR REFERÊNCIA':
        return 'por referência'
      case 'PAGAMENTO A CASH':
      case 'CASH':
        return 'pagamento a cash'

      case 'MUTUE_CASH':
        return 'muteu cash'

      default:
        // Retorna o valor original em minúsculas, caso exista
        return metodo.toLowerCase()
    }
  }
  const NotaDetalhes = ({ nota }: { nota: NotaPagamento }) => (
    // ... (Seu componente NotaDetalhes permanece o mesmo, mas usará os dados mapeados) ...
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          Ver Detalhes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pagamento</DialogTitle>
          <DialogDescription>Número: {nota.numero}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold mb-1">Tipo</p>
              <p className="text-sm text-muted-foreground capitalize">
                {nota.tipo}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">Status</p>
              {getStatusBadge(nota.status)}
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">Data de Emissão</p>
              <p className="text-sm text-muted-foreground">
                {new Date(nota.dataEmissao).toLocaleDateString('pt-PT')}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">Data de Vencimento</p>
              <p className="text-sm text-muted-foreground">
                {new Date(nota.dataVencimento).toLocaleDateString('pt-PT')}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-semibold mb-2">Descrição</p>
            <p className="text-sm text-muted-foreground">{nota.descricao}</p>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Valor Total</p>
              <p className="text-2xl font-bold text-primary">
                {nota.valor.toLocaleString('pt-PT')} Kz
              </p>
            </div>
          </div>

          {nota.status === 'concluido' && (
            <div className="border-t pt-4 space-y-3">
              <div>
                <p className="text-sm font-semibold mb-1">
                  Método de Pagamento
                </p>
                <p className="text-sm text-muted-foreground">
                  {getMetodoPagamento(nota.metodoPagamento)}
                </p>
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <ComprovantePagamento payment={nota} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  const totalPago = notas
    .filter((n) => n.status == 'concluido')
    .reduce((sum, n) => sum + n.valor, 0)

  // --- Tratamento de Estado de Carregamento e Erro ---

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
        <p>Carregando dados dos pagamentos Liquidados...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6 text-destructive">
          <p className="font-semibold">Erro ao carregar os dados.</p>
          <p className="text-sm">Por favor, tente novamente mais tarde.</p>
        </CardContent>
      </Card>
    )
  }

  // --- Renderização Principal ---
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold"> Histórico de Pagamentos</h1>
          <p className="text-muted-foreground mt-2">
            Consulte os Históricos de Pagamentos concluídos
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground" />

          <YearSelect
            academicYears={academicYears}
            selectedYear={selectedYear}
            onChange={setSelectedYear}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Pago */}
        <Card className="border rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-2 flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-700">
              Total Pago
            </CardTitle>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
              Resolução Anual
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {totalPago.toLocaleString('pt-PT')} Kz
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Valor total pago ao longo do ano
            </p>
          </CardContent>
        </Card>

        {/* Total de Notas */}
        <Card className="border rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-2 flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-700">
              Total de Notas Liquidadas
            </CardTitle>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              Resolução Anual
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {notas.length}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Número total de notas registadas neste ano
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Notas de Pagamento</CardTitle>
          <CardDescription>
            Lista completa das suas notas de pagamento Concluídos
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {notas.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">
                Não há notas de pagamento registradas para este período.
              </p>
            ) : (
              notas.map((nota) => (
                <Card key={nota.numero}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-semibold">{nota.descricao}</p>
                            <p className="text-sm text-muted-foreground">
                              {nota.numero}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {getTipoBadge(nota.tipo)}
                          {getStatusBadge(nota.status)}
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end gap-3">
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            {nota.valor.toLocaleString('pt-PT')} Kz
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Data de Pagamento:{' '}
                            {new Date(nota.dataFactura).toLocaleDateString(
                              'pt-PT',
                            )}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <NotaDetalhes nota={nota} />
                          {nota.status === 'concluido' && nota.comprovante && (
                            <Button variant="outline" size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Comprovante
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
