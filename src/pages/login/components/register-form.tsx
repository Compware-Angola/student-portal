import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SelectFormField } from '@/components/selectFormField'

import { Field, FieldGroup } from '@/components/ui/field'

import { Form } from '@/components/ui/form'
import { InputFormField } from '@/components/input-form-field'
import { Spinner } from '@/components/ui/spinner'
import { useRegisterForm } from '../use-register-form'
import { FormFooter } from './form-footer'

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const { form, onSubmit } = useRegisterForm()

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex flex-col gap-6', className)}
        {...props}
      >
        <FieldGroup>
          <SelectFormField
            name="registerType"
            fullWidth
            control={form.control}
            label="Tipo de Candidatura"
            placeholder="Tipo de Candidatura"
            items={[
              { label: 'Linceciatura', value: 'licenciatura' },
              { label: 'Mestrado e Doutoramento', value: 'mestrado' },
            ]}
          />
          <InputFormField
            control={form.control}
            name="fullname"
            placeholder="Nome Completo"
            label="Nome completo"
            type="text"
          />
          <SelectFormField
            name="documentType"
            fullWidth
            control={form.control}
            label="Tipo de Documento"
            placeholder="Tipo de Documento"
            items={[
              { label: 'Bilhete de identidade', value: 'bilhete' },
              { label: 'Passaporte', value: 'Passaporte' },
            ]}
          />

          <InputFormField
            control={form.control}
            name="documentNumber"
            placeholder="example"
            label="Número de Documento"
            type="text"
          />

          <InputFormField
            control={form.control}
            name="email"
            placeholder="example@mail.com"
            label="Email"
            type="email"
          />
          <InputFormField
            control={form.control}
            name="phone"
            placeholder="+244 999 999 999"
            label="Telefone"
            type="tel"
          />
          <InputFormField
            control={form.control}
            name="password"
            autoComplete="current-password"
            placeholder="********"
            label="Senha"
            type="password"
          />
          <Field>
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting && <Spinner />}
              Criar sua Conta
            </Button>
          </Field>
          <FormFooter />
        </FieldGroup>
      </form>
    </Form>
  )
}
