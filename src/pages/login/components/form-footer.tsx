import { Field, FieldDescription, FieldSeparator } from '@/components/ui/field'

export function FormFooter() {
  return (
    <>
      <FieldSeparator />
      <Field>
        <FieldDescription className="text-center">
          © {new Date().getFullYear()} Universidade Metodista de Angola. Todos
          os direitos reservados.
        </FieldDescription>
      </Field>
    </>
  )
}
