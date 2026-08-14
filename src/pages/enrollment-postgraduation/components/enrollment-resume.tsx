import { AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { formatCurrency } from '@/utils'

import { useEnrollment } from '../hooks/use-enrollment'
import { ResumoItem } from './resumo-item'
import { SubjectItem } from './subject-item'

export function EnrollmentResume() {
  const {
    selectedSubjects,
    confirmStudentEnrollment,
    confirmStudentEnrollmentState,
    enrollmentStatus,
    totalPagar,
    foraPrazoValue,
    firstMonthlyFee

  } = useEnrollment()

  if (selectedSubjects.length === 0) return null
  const isValidFirstMonthlyFee = Boolean(firstMonthlyFee)
  const isSubmitting = confirmStudentEnrollmentState
  const isForaDePrazo = enrollmentStatus === 'closed'

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
            <SubjectItem key={subject.codigoGrade} subject={subject} tipoCandidatura='Pos-Graduacao' />
          ))}
        </ul>

        <div className="space-y-2 pt-4">
         
         {isValidFirstMonthlyFee && <ResumoItem
            label="Valor da primeira mensalidade"
            value={formatCurrency(firstMonthlyFee)}
          />}

          {isForaDePrazo && (
            <ResumoItem
              label="Taxa de inscrição fora de época"
              value={formatCurrency(foraPrazoValue)}
            />
          )}
{
  isValidFirstMonthlyFee &&  (<ResumoItem
            label="Total a pagar"
            value={formatCurrency(totalPagar)}
            destaque
          />)
}
        </div>
{
  isValidFirstMonthlyFee &&  (
  <Button
          className="w-full"
          size="lg"
          onClick={confirmStudentEnrollment}
          disabled={isSubmitting || !isValidFirstMonthlyFee}
        >
          {isSubmitting ? <Spinner /> : ' Matrícular-se'}
        </Button>)
}
       
      </CardContent>
    </Card>
  )
}