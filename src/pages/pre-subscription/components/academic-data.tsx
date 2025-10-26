import { InputFormField } from '@/components/input-form-field'
import { useFormPreSubscriptionForm } from './form-provider'

export function AcademicData() {
  const { form } = useFormPreSubscriptionForm()
  return (
    <>
      <InputFormField
        label="Instituição de Ensino"
        control={form.control}
        name="previousSchool"
        placeholder="Nome da escola"
        type="text"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputFormField
          label="Ano de Conclusão"
          control={form.control}
          name="graduationYear"
          placeholder="2024"
          type="date"
        />
        <InputFormField
          label="Ano de Conclusão"
          control={form.control}
          name="averageGrade"
          placeholder="16.5"
          type="number"
        />
      </div>
    </>
  )
}
