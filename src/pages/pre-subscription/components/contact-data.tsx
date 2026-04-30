import { InputFormField } from '@/components/input-form-field'
import { useFormPreSubscriptionForm } from './form-provider'

export function ContactData() {
  const { form } = useFormPreSubscriptionForm()
  return (
    <>
      <InputFormField
        label="Email"
        control={form.control}
        name="email"
        placeholder="Email"
        type="text"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputFormField
        label="Telefone"
        control={form.control}
        name="phone"
        placeholder="Telefone"
        type="text"
      />
        <InputFormField
          label="Telefone Alternativo"
          control={form.control}
          name="phoneAlt"
          placeholder="Telefone Alternativo"
          type="text"
        />
      </div>
      <InputFormField
        label="Morada"
        control={form.control}
        name="street"
        placeholder="Morada"
        type="text"
      />
    </>
  )
}
