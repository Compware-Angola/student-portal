import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SelectFormField } from '@/components/selectFormField'

import { Field, FieldGroup } from '@/components/ui/field'

import { Form } from '@/components/ui/form'
import { InputFormField } from '@/components/input-form-field'
import { Spinner } from '@/components/ui/spinner'
import { useRegisterForm } from '../use-register-form'

type RegisterFormProps = React.ComponentProps<'form'> & {
  onSuccess?: () => void
}

export function RegisterForm({
  className,
  onSuccess,
  ...props
}: RegisterFormProps) {
  const {
    form,
    onSubmit,
    faculdadesOptions,
    tipoCandidaturaOptions,
    tipoDocumentoOptions,
  } = useRegisterForm()

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (data) => {
            console.log('SUBMIT OK', data)
            onSubmit(data)
            onSuccess?.()
            form.reset()
          },
          (errors) => {
            console.log('ERROS DO FORM', errors)
          },
        )}
        className={cn('flex flex-col gap-6', className)}
        {...props}
      >
        <FieldGroup>
          <InputFormField
            control={form.control}
            name="name"
            placeholder="Nome Completo"
            label="Nome completo"
            type="text"
          />
          <div className="grid grid-cols-2 space-x-2">
            <SelectFormField
              name="grauacademico"
              fullWidth
              control={form.control}
              label="Tipo de Candidatura"
              placeholder="Tipo de Candidatura"
              items={tipoCandidaturaOptions}
            />
            <SelectFormField
              name="faculdade"
              fullWidth
              control={form.control}
              label="Faculdade"
              placeholder="Faculdade"
              items={faculdadesOptions}
            />
          </div>

          <div className="grid grid-cols-2 space-x-2">
            <InputFormField
              control={form.control}
              name="email"
              placeholder="example@mail.com"
              label="Email"
              type="email"
            />
            <InputFormField
              control={form.control}
              name="telefone"
              placeholder="+244 999 999 999"
              label="Telefone"
              type="tel"
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 space-x-2">
            <SelectFormField
              name="tipo_de_documento"
              fullWidth
              control={form.control}
              label="Tipo de Documento"
              placeholder="Tipo de Documento"
              items={tipoDocumentoOptions}
            />

            <InputFormField
              control={form.control}
              name="numero_documento"
              placeholder="005478963LA042"
              label="Número de Documento"
              type="text"
            />
          </div>

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
          {/* <FormFooter /> */}
        </FieldGroup>
      </form>
    </Form>
  )
}
