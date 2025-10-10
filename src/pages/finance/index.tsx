import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Wallet, CheckCircle2, Clock, BookOpen } from 'lucide-react'
import { StatCard } from './componets/stat-card'
import { TuitionItem } from './componets/tuition-item'
import { FeeItem } from './componets/fee-item'
import { HistoryItem } from './componets/history-item'

export function Finance() {
  const [stats] = useState([
    {
      title: 'Total do Ano',
      value: 'AOA 1.080.000',
      icon: BookOpen,
      color: 'bg-purple-500',
      description: 'Ano Letivo 2024/2025',
    },
    {
      title: 'Valor Pago',
      value: 'AOA 720.000',
      icon: CheckCircle2,
      color: 'bg-emerald-500',
      description: '8 de 12 mensalidades',
    },
    {
      title: 'Em Aberto',
      value: 'AOA 360.000',
      icon: Clock,
      color: 'bg-yellow-500',
      description: '4 mensalidades',
    },
    {
      title: 'Situação',
      value: 'Regular',
      icon: Wallet,
      color: 'bg-blue-500',
      description: 'Sem pendências',
    },
  ])

  const [tuitions] = useState([
    {
      id: 1,
      month: 'Outubro 2024',
      amount: 90000,
      dueDate: '10/10/2024',
      status: 'paid',
      reference: 'MENS-2024-10',
    },
    {
      id: 2,
      month: 'Novembro 2024',
      amount: 90000,
      dueDate: '10/11/2024',
      status: 'pending',
      reference: 'MENS-2024-11',
    },
    {
      id: 3,
      month: 'Dezembro 2024',
      amount: 90000,
      dueDate: '10/12/2024',
      status: 'pending',
      reference: 'MENS-2024-12',
    },
    {
      id: 4,
      month: 'Janeiro 2025',
      amount: 90000,
      dueDate: '10/01/2025',
      status: 'pending',
      reference: 'MENS-2025-01',
    },
  ])

  const [fees] = useState([
    {
      id: 1,
      title: 'Taxa de Matrícula',
      amount: 150000,
      date: '01/09/2024',
      status: 'paid',
      category: 'Matrícula',
    },
    {
      id: 2,
      title: 'Material Didático',
      amount: 45000,
      date: '05/09/2024',
      status: 'paid',
      category: 'Material',
    },
    {
      id: 3,
      title: 'Seguro Escolar',
      amount: 20000,
      date: '01/09/2024',
      status: 'paid',
      category: 'Seguro',
    },
    {
      id: 4,
      title: 'Atividades Extracurriculares',
      amount: 35000,
      date: '15/09/2024',
      status: 'pending',
      category: 'Atividades',
    },
  ])

  const [history] = useState([
    {
      id: 1,
      description: 'Mensalidade Outubro 2024',
      amount: 90000,
      date: '08/10/2024',
      type: 'Mensalidade',
    },
    {
      id: 2,
      description: 'Mensalidade Setembro 2024',
      amount: 90000,
      date: '07/09/2024',
      type: 'Mensalidade',
    },
    {
      id: 3,
      description: 'Taxa de Matrícula',
      amount: 150000,
      date: '01/09/2024',
      type: 'Taxa',
    },
    {
      id: 4,
      description: 'Material Didático',
      amount: 45000,
      date: '05/09/2024',
      type: 'Material',
    },
    {
      id: 5,
      description: 'Seguro Escolar',
      amount: 20000,
      date: '01/09/2024',
      type: 'Seguro',
    },
  ])

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold  mb-2">Finanças</h1>
            <p className="">Acompanhe suas mensalidades e pagamentos</p>
          </div>
          {/*<div className="flex gap-3">
            <Button
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <CreditCard className="w-4 h-4 mr-2" />
              Fazer Pagamento
            </Button>
          </div>*/}
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Tabs de Conteúdo */}
        <Tabs defaultValue="tuitions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tuitions">Mensalidades</TabsTrigger>
            <TabsTrigger value="fees">Taxas e Serviços</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          {/* Tab: Mensalidades */}
          <TabsContent value="tuitions" className="mt-6">
            <Card className="">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Mensalidades do Ano Letivo</span>
                  <Badge className="">2024/2025</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tuitions.map((tuition) => (
                  <TuitionItem
                    key={tuition.id}
                    amount={tuition.amount}
                    dueDate={tuition.dueDate}
                    status={tuition.status as 'paid' | 'pending' | 'overdue'}
                    month={tuition.month}
                    reference={tuition.reference}
                  />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Taxas */}
          <TabsContent value="fees" className="mt-6">
            <Card className="">
              <CardHeader>
                <CardTitle>Taxas e Serviços Escolares</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {fees.map((fee) => (
                  <FeeItem
                    key={fee.id}
                    amount={fee.amount}
                    category={fee.category}
                    date={fee.date}
                    status={fee.status as 'paid' | 'pending'}
                    title={fee.title}
                  />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Histórico */}
          <TabsContent value="history" className="mt-6">
            <Card className="">
              <CardHeader>
                <CardTitle className="">Histórico de Pagamentos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {history.map((item) => (
                  <HistoryItem
                    key={item.id}
                    amount={item.amount}
                    date={item.date}
                    description={item.description}
                    type={item.type}
                  />
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
