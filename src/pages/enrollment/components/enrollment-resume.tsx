import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

import { Spinner } from '@/components/ui/spinner'
import { formatCurrency } from '@/utils'

import { useEnrollment } from '../hooks/use-enrollment'
import { SubjectItem } from './subject-item'
import { ResumoItem } from './resumo-item'

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
    totalPagar,
    foraPrazoValue,
    taxaMatriculaValue,
  } = useEnrollment()

  if (selectedSubjects.length === 0) return null

  return (
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
            <SubjectItem
              key={subject.codigoGrade}
              subject={subject}
              disabled={isNewStudentWithOutEnrollment}
              onRemove={remove}
            />
          ))}
        </ul>

        <div className="pt-4 space-y-2">
          <ResumoItem
            label="Taxa de inscrição por disciplina"
            value={formatCurrency(totalValue)}
          />

          <ResumoItem
            label="Taxa de matrícula"
            value={formatCurrency(taxaMatriculaValue)}
          />

          {enrollmentStatus === 'closed' && (
            <ResumoItem
              label="Taxa de inscrição fora de época"
              value={formatCurrency(foraPrazoValue)}
            />
          )}

          <ResumoItem
            label="Total a pagar"
            value={formatCurrency(totalPagar)}
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
            {confirmStudentEnrollmentState ? (
              <Spinner />
            ) : (
              'Confirmar Matrícula'
            )}
          </Button>

          <Button
            variant="outline"
            size="lg"
            disabled={isNewStudentWithOutEnrollment}
            onClick={removeAll}
          >
            Limpar Seleção
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
