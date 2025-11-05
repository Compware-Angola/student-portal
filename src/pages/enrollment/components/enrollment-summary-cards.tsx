import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, FileText, GraduationCap, LibraryBig, TrendingUp } from 'lucide-react'
import { useEnrollment } from '../hooks/use-enrollment'
import { StudentSituation } from '@/constants/student-situation'
import { Progress } from '@radix-ui/react-progress'
import { useQueryCurrentAcademicYear } from '@/hooks/academic-year/use-query-current-academic-year'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'

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
    const {data:academicYear}=useQueryCurrentAcademicYear()
    const {profileData}= useQueryProfile()

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
    <div className='space-y-3'>

      {
        enrollmentState ? <div>
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Ano Curricular {academicYear?.designacao}</CardTitle>
                  <CardDescription> {profileData?.confirmacoes[0].classe}º Ano - {profileData?.curso}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Periodo</p>
                  </div>
                  <p className="text-2xl font-bold"> {profileData?.periodo}</p>
                  <p className="text-xs text-muted-foreground">No ano atual</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Polo</p>
                  </div>
                  <p className="text-2xl font-bold text-primary">{profileData?.polo}</p>
                  <p className="text-xs text-muted-foreground">A decorrer</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Cadeirante</p>
                  </div>
                  <p className="text-2xl font-bold"> {profileData?.confirmacoes[0].cadeirante}</p>
                  <p className="text-xs text-muted-foreground">Este ano</p>
                </div>

              
              </div>
            </CardContent>
          </Card>
        </div> :
          <div className="grid gap-4 md:grid-cols-2">
            {cards.map((card, index) => (
              <SummaryCard key={index} {...card} />
            ))}
          </div>
      }


    </div>


  )
}
