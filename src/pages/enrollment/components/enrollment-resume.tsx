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
            <div className="pt-4">
              {enrollmentStatus === 'closed' && (
                <div className="flex justify-between text-lg font-bold">
                  <span>Taxa de Inscrição Fora de Prazo:</span>
                  <span>{formatCurrency(10200)}</span>
                </div>
              )}

              <div className="flex justify-between text-lg font-bold">
                <span>Disciplinas Calculadas:</span>
                <span>{formatCurrency(totalValue)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total a pagar :</span>
                <span>{formatCurrency(totalValue + valorAcrescer)}</span>
              </div>
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
              <Button variant="outline" size="lg" onClick={removeAll}>
                Limpar Seleção
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
