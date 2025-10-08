import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from '@/components/ui/field'

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
        className={cn('flex flex-col gap-6', className)}
        {...props}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Bem-vindo</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Acesse sua conta estudantil
            </p>
          </div>
          <InputFormField
            control={form.control}
            name="username"
            placeholder="example"
            label="Nome de usuário"
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
          <FieldSeparator></FieldSeparator>
          <Field>
            <FieldDescription className="text-center">
              © {new Date().getFullYear()} Universidade Metodista de Angola.
              Todos os direitos reservados.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  )
}
