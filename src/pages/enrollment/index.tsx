import { toast } from 'sonner'
import { EnrollmentHeader } from './components/enrollment-header'
import { EnrollmentResume } from './components/enrollment-resume'
import { EnrollmentSection } from './components/enrollment-section'
import { EnrollmentSummaryCards } from './components/enrollment-summary-cards'
import { EnrollmentProvider } from './context/enrollment.provider'
import { useEnrollment } from './hooks/use-enrollment'
import { EnrollmentSkeleton } from './components/enrollment-skeleton'

import { Badge } from '@/components/ui/badge'

function EnrollmentContent() {
  const { subject, isLoading, isError, pendingSubjects, isNewStudent } =
    useEnrollment()

  if (isLoading || isError) {
    if (isError) {
      toast.error('Erro ao carregar dados')
    }
    return <EnrollmentSkeleton />
  }

  return (
    <div className="space-y-6">
      <EnrollmentHeader />
      <EnrollmentSummaryCards />

      <div>
        <div>
          <div className="flex items-center justify-between my-2">
            <p>Disciplinas Disponíveis</p>
            <Badge variant="outline">
              {isNewStudent ? 'Aluno Novo' : 'Aluno Antigo'}
            </Badge>
          </div>
        </div>
        <div className="space-y-6">
          <EnrollmentSection
            label="Novas"
            subjects={subject}
            secktionKey="new"
          />
          <EnrollmentSection
            label="Pendentes"
            subjects={pendingSubjects}
            secktionKey="pendents"
          />
        </div>
      </div>

      <EnrollmentResume />
    </div>
  )
}

export function Enrollment() {
  return (
    <EnrollmentProvider>
      <EnrollmentContent />
    </EnrollmentProvider>
  )
}
