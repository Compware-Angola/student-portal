import { useFormPreSubscriptionForm } from './form-provider'
import { SelectFormField } from '@/components/selectFormField'

export function AcademicDocument() {
  const { form } = useFormPreSubscriptionForm()
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectFormField
          placeholder="Selecione"
          control={form.control}
          fullWidth
          name="pole"
          label="Polo"
          items={[
            { value: 'Luanda', label: 'Luanda' },
            { value: 'Talatona', label: 'Talatona' },
          ]}
        />
        <SelectFormField
          name="intendedCourse"
          control={form.control}
          fullWidth
          label="Curso Pretendido"
          items={[
            { value: 'Gestao', label: 'Gestão' },
            { value: 'Informatica', label: 'Informática' },
          ]}
        />
      </div>
    </>
  )
}
