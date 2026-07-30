import React from 'react'
import { BookOpen, LibraryBig } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import { useEnrollment } from '../hooks/use-enrollment'

interface SummaryCardProps {
  icon: React.ElementType
  title: string
  value: React.ReactNode
  description?: string
  footer?: React.ReactNode
}

function SummaryCard({
  icon: Icon,
  title,
  value,
  description,
  footer,
}: SummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
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

const enrollmentStatusConfig = {
  closed: {
    label: 'Matrícula Aberta - Fora de Época',
    className: 'bg-red-100 text-red-700',
  },
  not_yet_open: {
    label: 'Matrícula Aberta - Ainda não iniciada',
    className: 'bg-gray-100 text-gray-700',
  },
  open: {
    label: 'Matrícula Aberta',
    className: 'bg-green-100 text-green-700',
  },
} as const

export function EnrollmentSummaryCards() {
  const {
    selectedSubjects,
    enrollmentStatus,
    
    
  } = useEnrollment()

  const statusConfig =
    enrollmentStatusConfig[
      enrollmentStatus as keyof typeof enrollmentStatusConfig
    ] ?? enrollmentStatusConfig.open

  const enrollmentBadge = (
    <Badge className={statusConfig.className}>{statusConfig.label}</Badge>
  )


  const cards: SummaryCardProps[] = [
    {
      icon: BookOpen,
      title: 'Disciplinas Selecionadas',
      value: selectedSubjects?.length ?? 0,
      description: 'Total selecionadas',
    },

    {
      icon: LibraryBig,
      title: 'Estado da Matrícula',
      value: enrollmentBadge,
   
    },
  ]


  return (
    <div
      className={cn(
        'grid gap-4',
        'md:grid-cols-2',
      )}
    >
      {cards.map((card, index) => (
        <SummaryCard key={index} {...card} />
      ))}
    </div>
  )
}