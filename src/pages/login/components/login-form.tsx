import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { InputFormField } from "@/components/input-form-field"


const FormSchema = z.object({
  username: z.string().min(1, {
    message: "Nome de usuário é obrigatório",

  }),
  password: z.string().min(1, {
    message: "Senha é obrigatória",
  }),
})


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  })

    function onSubmit(data: z.infer<typeof FormSchema>) {
   
  }
  return (
    <Form {...form}>
    <form  onSubmit={form.handleSubmit(onSubmit)}  className={cn("flex flex-col gap-6", className)} {...props}>
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
          placeholder="********"
          label="Senha"
          type="password"
        />
        <Field>
          <Button type="submit">Entrar</Button>
        </Field>
        <FieldSeparator></FieldSeparator>
        <Field>
        
          <FieldDescription className="text-center">
            © {new Date().getFullYear()} Universidade Metodista de Angola. Todos os direitos reservados.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
    </Form>
  )
}
