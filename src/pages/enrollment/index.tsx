import { toast } from 'sonner'
import { EnrollmentHeader } from './components/enrollment-header'
import { EnrollmentResume } from './components/enrollment-resume'
import { EnrollmentSection } from './components/enrollment-section'
import { EnrollmentSummaryCards } from './components/enrollment-summary-cards'
import { EnrollmentProvider } from './context/enrollment.provider'
import { useEnrollment } from './hooks/use-enrollment'
import { EnrollmentSkeleton } from './components/enrollment-skeleton'

function EnrollmentContent() {
  const { subject, isLoading, isError } = useEnrollment()

  if (isLoading || isError) {
    if (isError) {
      toast.error('Erro ao carregar dados')
    }
    return <EnrollmentSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <EnrollmentHeader />
        <EnrollmentSummaryCards />

        <EnrollmentSection label="Disciplinas" subjects={subject} />

        <EnrollmentResume />
      </div>
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
