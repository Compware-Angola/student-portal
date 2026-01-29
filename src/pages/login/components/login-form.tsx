import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup } from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { InputFormField } from '@/components/input-form-field'
import { useLoginForm } from '../use-login-form'
import { Spinner } from '@/components/ui/spinner'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const { form, onSubmit } = useLoginForm()

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex flex-col gap-6 pb-20', className)}
        {...props}
      >
        <FieldGroup>
          <InputFormField
            control={form.control}
            name="username"
            placeholder="Digite nome do usuário, email ou BI"
            label="Usuário, Email ou BI"
            type="text"
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
              Entrar
            </Button>
          </Field>
          {/* <FormFooter /> */}
        </FieldGroup>
      </form>
    </Form>
  )
}
