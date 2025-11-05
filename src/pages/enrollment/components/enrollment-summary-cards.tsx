import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, LibraryBig } from 'lucide-react'
import { useEnrollment } from '../hooks/use-enrollment'
import { StudentSituation } from '@/constants/student-situation'

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
  const { selectedSubjects, enrollmentStatus, studentSituation } =
    useEnrollment()

  const enrollmentState =
    StudentSituation.NEW_WITH_CURRENT_CONFIRMATION ===
      Number(studentSituation?.codigo_status) ||
    StudentSituation.OLD_WITH_CURRENT_CONFIRMATION ===
      Number(studentSituation?.codigo_status)

  const enrollmentBadge = (
    <Badge
      className={
        enrollmentStatus === 'closed'
          ? 'bg-red-100 text-red-700'
          : enrollmentStatus === 'not_yet_open'
            ? 'bg-gray-100 text-gray-700'
            : 'bg-green-100 text-green-700'
      }
    >
      {enrollmentState ? 'Matriculado' : 'Matrícula Aberta'}{' '}
      {enrollmentStatus === 'closed' && '- Fora de Época'}
      {enrollmentStatus === 'not_yet_open' && '- Ainda não iniciada'}
    </Badge>
  )

  // 🧩 Cards principais
  const cards = [
    {
      icon: BookOpen,
      title: 'Disciplinas Selecionadas',
      value: selectedSubjects.length,
      description: 'Total selecionadas',
    },
    {
      icon: LibraryBig,
      title: 'Estado da Matrícula',
      value: enrollmentBadge,
      description: 'Situação da inscrição atual',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map((card, index) => (
        <SummaryCard key={index} {...card} />
      ))}
    </div>
  )
}
