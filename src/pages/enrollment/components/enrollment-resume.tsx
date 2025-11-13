import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle } from 'lucide-react'
import { useEnrollment } from '../hooks/use-enrollment'
import { formatCurrency } from '@/utils'
import { Spinner } from '@/components/ui/spinner'

export function EnrollmentResume() {
  const {
    selectedSubjects,
    totalValue,
    remove,
    removeAll,
    confirmStudentEnrollment,
    confirmStudentEnrollmentState,
    enrollmentStatus,
    isNewStudentWithOutEnrollment,
  } = useEnrollment()
  const valorAcrescer = enrollmentStatus === 'closed' ? 10200 : 0
  return (
    <>
      {selectedSubjects.length === 0 ? null : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Resumo da Matrícula
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <ul className="space-y-1 text-sm">
              {selectedSubjects.map((subject) => (
                <li
                  key={subject.codigoGrade}
                  className="flex items-center justify-between gap-4 border-b py-5"
                >
                  <div className="flex flex-col gap-2">
                    <span className="font-medium">{subject.disciplina}</span>

                    <Badge
                      variant={
                        subject.duracaoDisciplina === 'Anual'
                          ? 'secondary'
                          : 'default'
                      }
                      className="text-xs"
                    >
                      {subject.duracaoDisciplina}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-medium">
                      {formatCurrency(Number(subject.valorInscricao))}
                    </span>
                    <Button
                      disabled={isNewStudentWithOutEnrollment}
                      variant="outline"
                      size="sm"
                      onClick={() => remove(subject.codigoGrade)}
                    >
                      Remover
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="pt-4 space-y-2">
              <ResumoItem
                label="Taxa de inscrição por disciplina"
                value={formatCurrency(totalValue)}
              />

              <ResumoItem
                label="Taxa de matrícula"
                value={formatCurrency(19300)}
              />

              {enrollmentStatus === 'closed' && (
                <ResumoItem
                  label="Taxa de inscrição fora de época"
                  value={formatCurrency(10200)}
                />
              )}

              <ResumoItem
                label="Total a pagar"
                value={formatCurrency(totalValue + valorAcrescer + 19300)}
                destaque
              />
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1"
                size="lg"
                onClick={confirmStudentEnrollment}
                disabled={confirmStudentEnrollmentState}
              >
                <>
                  {confirmStudentEnrollmentState ? (
                    <>
                      <Spinner />
                    </>
                  ) : (
                    'Confirmar Matrícula'
                  )}
                </>
              </Button>
              <Button
                disabled={isNewStudentWithOutEnrollment}
                variant="outline"
                size="lg"
                onClick={removeAll}
              >
                Limpar Seleção
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
function ResumoItem({
  label,
  value,
  destaque = false,
}: {
  label: string
  value: string
  destaque?: boolean
}) {
  return (
    <div
      className={`flex justify-between text-lg ${
        destaque ? 'font-extrabold text-primary' : 'font-semibold'
      }`}
    >
      <span>{label}:</span>
      <span>{value}</span>
    </div>
  )
}
