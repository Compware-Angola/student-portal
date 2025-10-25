import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, CurrencyIcon, LibraryBig } from 'lucide-react'
import { formatCurrency } from '@/utils'
import { useEnrollment } from '../hooks/use-enrollment'

function SummaryCard({
  icon: Icon,
  title,
  value,
  description,
  footer,
}: {
  icon: React.ElementType
  title: string
  value: React.ReactNode
  description?: string
  footer?: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium ">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs">{description}</p>}
        {footer && <div className="mt-2">{footer}</div>}
      </CardContent>
    </Card>
  )
}

export function EnrollmentSummaryCards() {
  const { selectedSubjects, totalValue } = useEnrollment()

  const cards = [
    {
      icon: BookOpen,
      title: 'Disciplinas Selecionadas',
      value: selectedSubjects.length,
      description: 'Total selecionadas',
    },
    {
      icon: CurrencyIcon,
      title: 'Valor Total',
      value: formatCurrency(totalValue),
      description: '',
    },
    {
      icon: LibraryBig,
      title: 'Estado',
      value: <Badge className="bg-blue-100 text-blue-800">Em andamento</Badge>,
      description: 'Matrícula aberta',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card, index) => (
        <SummaryCard key={index} {...card} />
      ))}
    </div>
  )
}
