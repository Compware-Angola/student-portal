import { EnrollmentHeader } from './components/enrollment-header'
import { EnrollmentResume } from './components/enrollment-resume'
import { EnrollmentSection } from './components/enrollment-section'
import { EnrollmentSummaryCards } from './components/enrollment-summary-cards'
import { EnrollmentProvider } from './context/enrollment.provider'
import { useEnrollment } from './hooks/use-enrollment'

function EnrollmentContent() {
  const { annual, firstSemester, secondSemester } = useEnrollment()

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <EnrollmentHeader />
        <EnrollmentSummaryCards />

        <EnrollmentSection label="ANUAL" subjects={annual} />
        <EnrollmentSection label="I SEMESTRE" subjects={firstSemester} />
        <EnrollmentSection label="II SEMESTRE" subjects={secondSemester} />

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
