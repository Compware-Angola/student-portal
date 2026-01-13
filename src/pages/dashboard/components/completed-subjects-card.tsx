'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap } from 'lucide-react'
import { useQueryStudentDashboardStatistics } from '@/hooks/statics/use-query-student-dashboard-statistics'
import { Skeleton } from '@/components/ui/skeleton'

interface CompletedSubjectsCardProps {
  enrollmentCode?: string
}

export const CompletedSubjectsCard = ({
  enrollmentCode,
}: CompletedSubjectsCardProps) => {
  const { data: statistics, isLoading } =
    useQueryStudentDashboardStatistics(enrollmentCode)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Disciplinas Concluídas
        </CardTitle>
        <GraduationCap className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold">
            {statistics?.quantidade_disciplinas_aprovadas || 0}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
