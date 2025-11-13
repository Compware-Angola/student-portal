import { Button } from '@/components/ui/button'
import { useEnrollment } from '../hooks/use-enrollment'
import { StudentSituation } from '@/constants/student-situation'

export function EnrollmentHeader() {
  const {
    selectAll,
    isAllSelected,
    studentSituation,
    isNewStudentWithOutEnrollment,
    profileData,
  } = useEnrollment()
  const enrollmentState =
    StudentSituation.NEW_WITH_CURRENT_CONFIRMATION ===
      Number(studentSituation?.codigo_status) ||
    StudentSituation.OLD_WITH_CURRENT_CONFIRMATION ===
      Number(studentSituation?.codigo_status)

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Matrícula</h1>
        {enrollmentState ? (
          <p></p>
        ) : (
          <p>Selecione as disciplinas para o ano letivo</p>
        )}
        <p>{profileData?.curso}</p>
      </div>

      {!enrollmentState && (
        <div className="flex items-center gap-3">
          <Button
            disabled={isNewStudentWithOutEnrollment}
            variant="outline"
            onClick={selectAll}
          >
            {isAllSelected() ? 'Desselecionar Tudo' : 'Selecionar Tudo'}
          </Button>
          {/*<Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          1º Ano - Ativo
        </Badge>*/}
        </div>
      )}
    </div>
  )
}
