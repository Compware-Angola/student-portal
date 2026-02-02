import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AlertCircle,
  BookOpen,
  FileText,
  GraduationCap,
  LibraryBig,
  TrendingUp,
} from 'lucide-react'
import { StudentSituation } from '@/constants/student-situation'
import { useQueryCurrentAcademicYear } from '@/hooks/academic-year/use-query-current-academic-year'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { cn } from '@/lib/utils'
import { useRegistrationsUC } from '../hooks/use-registrations-uc'

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
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'number' && isNaN(value) ? '—' : value}
        </div>
        {description && <p className="text-xs">{description}</p>}
        {footer && <div className="mt-2">{footer}</div>}
      </CardContent>
    </Card>
  )
}

export function EnrollmentSummaryCards() {
  const {
    selectedSubjects,
    enrollmentStatus,
    studentSituation,
    maxCourseGrade,
  } = useRegistrationsUC()

  const { data: academicYear } = useQueryCurrentAcademicYear()
  const { profileData } = useQueryProfile()

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
      {enrollmentState ? 'Inscrito' : 'Inscrição Aberta'}{' '}
      {!enrollmentState && (
        <>
          {enrollmentStatus === 'closed' && '- Fora de Época'}
          {enrollmentStatus === 'not_yet_open' && '- Ainda não iniciada'}
        </>
      )}
    </Badge>
  )

  // 🧩 Cards principais
  const cards = [
    {
      icon: BookOpen,
      title: 'Disciplinas Selecionadas',
      value: selectedSubjects?.length ?? 0,
      description: 'Total selecionadas',
    },
    {
      icon: BookOpen,
      title: 'Limite de cadeiras',
      value: !isNaN(Number(maxCourseGrade)) ? Number(maxCourseGrade) : 0,
      description: 'Máx. permitidas',
    },
    {
      icon: LibraryBig,
      title: 'Estado',
      value: enrollmentBadge,
      description: 'Situação da inscrição atual',
    },
  ]

  return (
    <div className="space-y-3">
      {enrollmentState ? (
        <>
          {profileData?.confirmacoes && profileData.confirmacoes.length > 0 ? (
            <div>
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>
                        Ano Curricular {academicYear?.designacao ?? '—'}
                      </CardTitle>
                      <br />
                      <CardDescription>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          {profileData.confirmacoes[0]?.classe ?? '—'}º Ano
                          Ativo
                        </Badge>{' '}
                        - {profileData?.curso ?? '—'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">Período</p>
                      </div>
                      <p className="text-2xl font-bold">
                        {profileData?.periodo ?? '—'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        No ano atual
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">Polo</p>
                      </div>
                      <p className="text-2xl font-bold text-primary">
                        {profileData?.polo ?? '—'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        A decorrer
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">Cadeirante</p>
                      </div>
                      <p className="text-2xl font-bold">
                        {profileData?.confirmacoes?.[0]?.cadeirante ?? '—'}
                      </p>
                      <p className="text-xs text-muted-foreground">Este ano</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-red-200 overflow-hidden">
              <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-75 w-24 h-24 mx-auto" />
                  <div className="relative animate-bounce-slow">
                    <AlertCircle className="h-20 w-20 text-red-600 drop-shadow-lg" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-red-900 mb-2">
                  Matrícula Pendente
                </h3>
                <p className="text-red-700 max-w-md leading-relaxed">
                  Por favor, verifique a situação do seu pagamento no sistema ou
                  dirija-se à secretaria para regularizar a situação e acessar a
                  sua matrícula.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <div className={cn('grid gap-4', 'md:grid-cols-3')}>
          {cards.map((card, index) => (
            <SummaryCard key={index} {...card} />
          ))}
        </div>
      )}
    </div>
  )
}
