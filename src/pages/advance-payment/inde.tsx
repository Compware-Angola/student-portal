import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SemesterCard } from './components/semester-card'
import { HistoryItem } from './components/history-item'
import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { BenefitsCard } from './components/benefits-card'

export function AdvancePayment() {
  const [payments] = useState([
    {
      id: 1,
      semester: '2024.2',
      period: 'Setembro - Dezembro 2024',
      amount: 180000,
      discount: 15,
    },
    {
      id: 2,
      semester: '2025.1',
      period: 'Março - Junho 2025',
      amount: 180000,
      discount: 20,
    },
  ])

  const [history] = useState([
    { id: 1, semester: 'Semestre 2024.1', amount: 144000, discount: 20 },
    { id: 2, semester: 'Semestre 2023.2', amount: 153000, discount: 15 },
  ])

  const handlePayment = (semester: string) => {
    alert(`Processando pagamento para ${semester}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br  py-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal - Pagamentos */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold">
                Pagamento Antecipado de Mensalidades
              </h1>
              <p className="">
                Aproveite descontos especiais pagando antecipadamente
              </p>
            </div>

            <BenefitsCard />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {payments.map((payment) => (
                <SemesterCard
                  key={payment.id}
                  semester={`Semestre ${payment.semester}`}
                  period={payment.period}
                  amount={payment.amount}
                  discount={payment.discount}
                  onPay={() => handlePayment(payment.semester)}
                />
              ))}
            </div>
          </div>

          {/* Coluna Lateral - Histórico */}
          <div className="lg:col-span-1">
            <Card className="backdrop-blur sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Histórico de Pagamentos Antecipados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {history.map((item) => (
                  <HistoryItem
                    key={item.id}
                    semester={item.semester}
                    amount={item.amount}
                    discount={item.discount}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
