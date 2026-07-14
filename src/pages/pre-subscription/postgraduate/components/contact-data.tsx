import { InputFormField } from '@/components/input-form-field'
import { useFormPreSubscriptionPostGraduateForm } from './hook'
import { useEffect } from 'react'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'

export function ContactDataPostGraduate() {
  const { form } = useFormPreSubscriptionPostGraduateForm()
  const { profileData } = useQueryProfile()
  useEffect(() => {
    if (!profileData) return
    form.setValue('email', profileData.email)
    form.setValue('phone', profileData.telefone)
  }, [profileData, form])
  return (
    <>
      <InputFormField
        label="Email"
        control={form.control}
        name="email"
        disabled
        placeholder="Email"
        type="text"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputFormField
          label="Telefone"
          control={form.control}
          name="phone"
          disabled
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
