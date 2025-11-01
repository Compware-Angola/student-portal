
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, Printer, Eye } from 'lucide-react'
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
import { useNavigate } from 'react-router-dom'
interface NotaPagamento {
    id: string
    numero: string 
    tipo: 'propina' | 'servico' | 'melhoria' | 'inscricao' | string
    descricao: string 
    valor: number 
    dataEmissao: string
    dataVencimento: string
    status: 'concluido' | 'pendente' | 'vencida' | string
    metodoPagamento?: 'cash' | 'transferencia' | 'muteu_cash' | 'deposito' | 'express' | 'por_referencia' | 'tpa'|string
    comprovante?: string 
}

// A função de mapeamento (colocada aqui apenas para exemplo, mas deve ser importada)
const mapApiToNotaPagamento = (apiData: any[]): NotaPagamento[] => {
    return apiData.map((item: any) => {
        let status: 'concluido' | 'pendente' | 'vencida' | string
        const isPaid = item.p_status_pagamento === 'concluido'
        const isExpired = item.f_DataVencimento && new Date(item.f_DataVencimento) < new Date() && !isPaid

        if (isPaid) {
            status = 'concluido'
        } else if (isExpired) {
            status = 'vencida'
        } else {
            status = 'pendente'
        }
        
        // Simples regra de tipo
        let tipo: string = 'servico'
        if (item.Descricao_produto && item.Descricao_produto.toLowerCase().includes('propina')) {
            tipo = 'propina'
        }

        return {
            id: String(item.CodigoPagamento || item.CodigoFactura), 
            numero: item.f_Referencia || `FAT-${item.CodigoFactura}`,
            tipo: tipo,
            descricao: item.Descricao_produto || item.Descricao_factura || 'Serviço/Fatura',
            valor: item.f_ValorAPagar || item.TotalItem || 0,
            dataEmissao: item.f_DataFactura,
            dataVencimento: item.f_DataVencimento,
            status: status,
            metodoPagamento: item.p_forma_pagamento ? item.p_forma_pagamento.replace(/\s/g, '_').toLowerCase() : undefined,
            comprovante: undefined, 
        }
    })
}


export const NotaPagamento = () => {
      const {profileData } = useQueryProfile()

  const navigate = useNavigate()
   
    

    const {
        data: pagamentosData, 
        isLoading, 
        isError
    } = useQueryPayments({
        academicYear: profileData?.confirmacoes[0]?.ano_lectivo,
        preRegistrationCode: profileData?.codigo_preinscricao,
        // Adicione page e limit se for paginar
        page: 1, 
        limit: 50 
    })

    // Mapear dados da API para o formato do componente
    const notas: NotaPagamento[] = pagamentosData?.data 
        ? mapApiToNotaPagamento(pagamentosData.data) 
        : []
    // --- FIM DA INTEGRAÇÃO ---


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
            case 'propina':
                return <Badge variant="outline">Propina</Badge>
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
            
        case 'MUTEU_CASH':
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
                            {/* O comprovante virá da API, mas por enquanto, manteremos a lógica */}
                            {nota.comprovante && (
                                <div>
                                    <p className="text-sm font-semibold mb-2">Comprovante</p>
                                    <Button variant="outline" size="sm">
                                        <Download className="mr-2 h-4 w-4" />
                                        Descarregar Comprovante
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <Button className="flex-1">
                            <Download className="mr-2 h-4 w-4" />
                            Descarregar PDF
                        </Button>
                        <Button variant="outline">
                            <Printer className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )

    // Cálculo dos Totais usando os dados reais
    const totalPendente = notas
        .filter((n) => n.status === 'pendente' || n.status === 'vencida')
        .reduce((sum, n) => sum + n.valor, 0)

    const totalPago = notas
        .filter((n) => n.status == 'concluido')
        .reduce((sum, n) => sum + n.valor, 0)

    // --- Tratamento de Estado de Carregamento e Erro ---

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
                <p>Carregando dados financeiros...</p>
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
            <div>
                <h1 className="text-3xl font-bold">Pagamento</h1>
                <p className="text-muted-foreground mt-2">
                    Consulte e gerencie os  pagamento
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card  onClick={() => navigate('/financas')}> 
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">
                            Total Pendente
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">
                            {totalPendente.toLocaleString('pt-PT')} Kz
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {totalPago.toLocaleString('pt-PT')} Kz
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">
                            Total de Notas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{notas.length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Notas</CardTitle>
                    <CardDescription>
                        Lista completa das suas notas de pagamento
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
                                <Card key={nota.id}>
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
                                                        Vence:{' '}
                                                        {new Date(nota.dataVencimento).toLocaleDateString(
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