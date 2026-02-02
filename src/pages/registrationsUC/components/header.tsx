import { Button } from '@/components/ui/button'
import { StudentSituation } from '@/constants/student-situation'
import { useRegistrationsUC } from '../hooks/use-registrations-uc'

export function RegistrationsUCtHeader() {
  const {
    selectAll,
    isAllSelected,
    studentSituation,

    profileData,
  } = useRegistrationsUC()
  const enrollmentState =
    StudentSituation.OLD_WITH_CURRENT_CONFIRMATION ===
    Number(studentSituation?.codigo_status)

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Inscrição na UC</h1>
        {enrollmentState ? (
          <p></p>
        ) : (
          <p>Selecione as disciplinas para o ano letivo</p>
        )}
        <p>{profileData?.curso}</p>
      </div>

      {!enrollmentState && (
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={selectAll}>
            {isAllSelected() ? 'Desselecionar Tudo' : 'Selecionar Tudo'}
          </Button>
        </div>
      )}
    </div>
  )
}
