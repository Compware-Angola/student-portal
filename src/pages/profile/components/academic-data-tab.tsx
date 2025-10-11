import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { TabsContent } from '@/components/ui/tabs'

export function AcademicDataTab() {
  return (
    <TabsContent value="academic" className="space-y-4 pt-4">
      <FieldSet>
        <FieldGroup className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="student-id">Número de Estudante</FieldLabel>
            <Input disabled id="student-id" type="text" value="N/A" />
          </Field>
          <Field>
            <FieldLabel htmlFor="course">Curso</FieldLabel>
            <Input id="course" value="N/A" disabled />
          </Field>

          <Field>
            <FieldLabel htmlFor="semester">Semestre Atual</FieldLabel>
            <Input id="semester" value="N/A" disabled />
          </Field>
          <Field>
            <FieldLabel htmlFor="enrollment">Data de Matrícula</FieldLabel>
            <Input id="enrollment" value="" disabled />
          </Field>
        </FieldGroup>
      </FieldSet>
    </TabsContent>
  )
}
