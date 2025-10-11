import { InputFormField } from '@/components/input-form-field'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

type PersonalDataTabProps = {
  name: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
}
export const FormSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  email: z.email('Insira um email válido'),
  phone: z.string().min(1, { message: 'Telefone é obrigatório' }),
  dateOfBirth: z
    .string()
    .min(1, { message: 'Data de nascimento é obrigatória' }),
  address: z.string().min(1, { message: 'Endereço é obrigatório' }),
})

export type LoginFormData = z.infer<typeof FormSchema>
export function PersonalDataTab({
  email,
  phone,
  dateOfBirth,
  address,
  name,
}: PersonalDataTabProps) {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name,
      email,
      phone,
      dateOfBirth,
      address,
    },
  })

  async function onSubmit(data: LoginFormData) {
    // Add your logic here to update the student's personal data
    return Promise.resolve(data)
  }
  return (
    <TabsContent value="personal" className="space-y-4 pt-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn('flex flex-col gap-6')}
        >
          <FieldGroup className="grid gap-4 md:grid-cols-2">
            <InputFormField
              control={form.control}
              name="name"
              placeholder="Nome Completo"
              label="Nome Completo"
              type="text"
              disabled
            />
            <InputFormField
              control={form.control}
              name="email"
              placeholder="email@example.com"
              label="Email"
              type="email"
              disabled
            />
            <InputFormField
              control={form.control}
              name="phone"
              placeholder="+244999999999"
              label="Número de Telefone"
              type="tel"
              disabled
            />
            <InputFormField
              control={form.control}
              name="dateOfBirth"
              placeholder="dd/mm/yyyy"
              label="Data de Nascimento"
              type="date"
              disabled
            />
          </FieldGroup>
          <FieldGroup>
            <InputFormField
              control={form.control}
              name="address"
              placeholder="Rua, Bairro, Cidade"
              label="Endereço"
              type="text"
              disabled
            />
          </FieldGroup>
          <Button disabled className="w-full">
            Salvar Alterações
          </Button>
        </form>
      </Form>
    </TabsContent>
  )
}
