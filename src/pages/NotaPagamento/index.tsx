import { useState } from 'react'

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

interface NotaPagamento {
  id: string
  numero: string
  tipo: 'propina' | 'servico' | 'melhoria' | 'inscricao'
  descricao: string
  valor: number
  dataEmissao: string
  dataVencimento: string
  status: 'paga' | 'pendente' | 'vencida'
  metodoPagamento?: 'cash' | 'transferencia' | 'muteu_cash'
  comprovante?: string
}

export const NotaPagamento = () => {
  // Mock data
  const [notas] = useState<NotaPagamento[]>([
    {
      id: '1',
      numero: 'NP-2024-001234',
      tipo: 'propina',
      descricao: 'Propina - Janeiro 2025',
      valor: 45000,
      dataEmissao: '2024-12-15',
      dataVencimento: '2025-01-31',
      status: 'pendente',
    },
    {
      id: '2',
      numero: 'NP-2024-001198',
      tipo: 'propina',
      descricao: 'Propina - Dezembro 2024',
      valor: 45000,
      dataEmissao: '2024-11-15',
      dataVencimento: '2024-12-31',
      status: 'paga',
      metodoPagamento: 'cash',
      comprovante: 'drive://comprovantes/dez2024.pdf',
    },
    {
      id: '3',
      numero: 'NP-2024-001156',
      tipo: 'melhoria',
      descricao: 'Melhoria de Nota - Programação I',
      valor: 15000,
      dataEmissao: '2024-11-10',
      dataVencimento: '2024-12-10',
      status: 'paga',
      metodoPagamento: 'muteu_cash',
      comprovante: 'drive://comprovantes/melhoria_prog1.pdf',
    },
    {
      id: '4',
      numero: 'NP-2024-001087',
      tipo: 'servico',
      descricao: 'Declaração de Matrícula',
      valor: 5000,
      dataEmissao: '2024-10-20',
      dataVencimento: '2024-11-20',
      status: 'paga',
      metodoPagamento: 'cash',
      comprovante: 'drive://comprovantes/declaracao.pdf',
    },
    {
      id: '5',
      numero: 'NP-2024-000923',
      tipo: 'propina',
      descricao: 'Propina - Setembro 2024',
      valor: 45000,
      dataEmissao: '2024-08-15',
      dataVencimento: '2024-09-30',
      status: 'vencida',
    },
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paga':
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
    if (!metodo) return 'N/A'
    switch (metodo) {
      case 'cash':
        return 'Dinheiro'
      case 'transferencia':
        return 'Transferência Bancária'
      case 'muteu_cash':
        return 'MUTEU Cash'
      default:
        return metodo
    }
  }

  const NotaDetalhes = ({ nota }: { nota: NotaPagamento }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          Ver Detalhes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nota de Pagamento</DialogTitle>
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

          {nota.status === 'paga' && (
            <div className="border-t pt-4 space-y-3">
              <div>
                <p className="text-sm font-semibold mb-1">
                  Método de Pagamento
                </p>
                <p className="text-sm text-muted-foreground">
                  {getMetodoPagamento(nota.metodoPagamento)}
                </p>
              </div>
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

  const totalPendente = notas
    .filter((n) => n.status === 'pendente' || n.status === 'vencida')
    .reduce((sum, n) => sum + n.valor, 0)

  const totalPago = notas
    .filter((n) => n.status === 'paga')
    .reduce((sum, n) => sum + n.valor, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notas de Pagamento</h1>
        <p className="text-muted-foreground mt-2">
          Consulte e gerencie as suas notas de pagamento
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
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
            {notas.map((nota) => (
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
                        {nota.status === 'paga' && nota.comprovante && (
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
