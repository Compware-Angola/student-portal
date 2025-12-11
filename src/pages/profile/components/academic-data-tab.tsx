import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { TabsContent } from '@/components/ui/tabs'

// Define a interface para as props esperadas
interface AcademicDataTabProps {
  studentId: string | number | null | undefined
  course: string | null | undefined
  semester: string | number | null | undefined
  enrollmentDate: string | null | undefined
}

// Função utilitária para garantir que um valor seja exibido ou 'N/A'
const formatValue = (value: any) => value || 'N/A'

export function AcademicDataTab({
  studentId,
  course,
  semester,
  enrollmentDate,
}: AcademicDataTabProps) {
  // Formata a data de matrícula (assumindo que enrollmentDate é uma string ISO-8601)
  const formattedEnrollmentDate = enrollmentDate
    ? new Date(enrollmentDate).toLocaleDateString('pt-AO')
    : 'N/A'

  return (
    <TabsContent value="academic" className="space-y-4 pt-4">
      <FieldSet>
        <FieldGroup className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="student-id">Número de Estudante</FieldLabel>
            <Input
              disabled
              id="student-id"
              type="text"
              // Usa a prop studentId com fallback 'N/A'
              value={formatValue(studentId)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="course">Curso</FieldLabel>
            {/* Usa a prop course com fallback 'N/A' */}
            <Input id="course" value={formatValue(course)} disabled />
          </Field>

          <Field>
            <FieldLabel htmlFor="semester">Semestre Atual</FieldLabel>
            {/* Usa a prop semester com fallback 'N/A' */}
            <Input id="semester" value={formatValue(semester)} disabled />
          </Field>
          <Field>
            <FieldLabel htmlFor="enrollment">Data de Matrícula</FieldLabel>
            {/* Usa a data formatada */}
            <Input id="enrollment" value={formattedEnrollmentDate} disabled />
          </Field>
        </FieldGroup>
      </FieldSet>
    </TabsContent>
  )
}
