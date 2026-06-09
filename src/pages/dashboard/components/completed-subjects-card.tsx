'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap } from 'lucide-react'
import { useQueryStudentDashboardStatistics } from '@/hooks/statics/use-query-student-dashboard-statistics'
import { Skeleton } from '@/components/ui/skeleton'


interface CompletedSubjectsCardProps {
  enrollmentCode?: string
  onClick?: () => void
}



export const CompletedSubjectsCard = ({
  enrollmentCode,
  onClick,
}: CompletedSubjectsCardProps) => {
  const { data: statistics, isLoading } =
    useQueryStudentDashboardStatistics(enrollmentCode)

  const completed = statistics?.quantidade_disciplinas_aprovadas ?? 0
  // const progress = Math.round((completed / TOTAL_SUBJECTS) * 100)

  return (
    <Card
      className={`transition-colors ${onClick ? 'cursor-pointer hover:bg-muted/40 active:bg-muted/60' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Disciplinas Concluídas</CardTitle>
        <GraduationCap className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-1.5 w-full rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">
              {completed}{' '}
              <span className="text-sm font-normal text-muted-foreground">
                {completed === 1 ? 'disciplina' : 'disciplinas'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {completed === 0
                ? 'Nenhuma disciplina concluída ainda'
                : `${completed} disciplinas concluídas`}
            </p>
            {/*
            <Progress value={progress} className="h-1.5 mt-2" />
            <p className="text-xs text-muted-foreground/60 text-right mt-1">
              {completed}/{TOTAL_SUBJECTS} concluídas
            </p>
            */}
          </>
        )}
      </CardContent>
    </Card>
  )
}