import { useEffect } from 'react'
import { InputFormField } from '@/components/input-form-field'
import { useFormPreSubscriptionForm } from './form-provider'
import { useQueryUser } from '@/hooks/candidate/use-query-user'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'

export function ContactData() {
  const { form } = useFormPreSubscriptionForm()
  const { data: user } = useQueryUser()
  const { profileData } = useQueryProfile()

  useEffect(() => {
    if (!user) return

    if (!form.getValues('email')) {
      form.setValue('email', user.email, {
        shouldValidate: true,
        shouldDirty: false,
      })
    }

    if (!form.getValues('phone')) {
      form.setValue('phone', user.telefone, {
        shouldValidate: true,
        shouldDirty: false,
      })
    }
  }, [user, form])

  useEffect(() => {
    if (!profileData) return

    if (!form.getValues('street')) {
      form.setValue('street', profileData.morada ?? '', {
        shouldValidate: true,
        shouldDirty: false,
      })
    }

    if (!form.getValues('phone')) {
      form.setValue('phone', profileData.contactos_telefonicos, {
        shouldValidate: true,
        shouldDirty: false,
      })
    }

    if (!form.getValues('email')) {
      form.setValue('email', profileData.email_1, {
        shouldValidate: true,
        shouldDirty: false,
      })
    }
  }, [profileData, form])

  return (
    <>
      <InputFormField
        label="Email"
        control={form.control}
        name="email"
        placeholder="Email"
        type="text"
        disabled
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputFormField
          label="Telefone"
          control={form.control}
          name="phone"
          placeholder="Telefone"
          type="text"
          disabled
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
