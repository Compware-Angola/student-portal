import { useEnrollment } from '../hooks/use-enrollment'

export function EnrollmentHeader() {
  const { profileData } = useEnrollment()

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Matrícula</h1>
        <p>{profileData?.curso}</p>
      </div>
    </div>
  )
}
