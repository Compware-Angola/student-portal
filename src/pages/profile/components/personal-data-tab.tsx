import { useState } from 'react'
import { InputFormField } from '@/components/input-form-field'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { toast } from 'sonner'
import { useUpdateUser } from '@/hooks/student/use-query-mutation-update-users-data'

type PersonalDataTabProps = {
  name: string
  email: string
  phone: string
  documento: string
  address: string
  userId: string
  isEditing: boolean
}

export const FormSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  email: z.email('Insira um email válido'),
  phone: z.string().min(1, { message: 'Telefone é obrigatório' }),
  documento: z.string().min(1, { message: 'Documento é obrigatório' }),
  address: z.string().min(1, { message: 'Endereço é obrigatório' }),
})

export type LoginFormData = z.infer<typeof FormSchema>

export function PersonalDataTab({
  email,
  phone,
  documento,
  address,
  name,
  userId,
  isEditing,
}: PersonalDataTabProps) {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name,
      email,
      phone,
      documento,
      address,
    },
  })

  // Hook para atualizar dados
  const { mutateAsync } = useUpdateUser(userId)
  const [loading, setLoading] = useState(false)

  const handleSaveClick = async () => {
    const data = form.getValues()
    try {
      setLoading(true)
      await mutateAsync({
        name: data.name,
        email: data.email,
        telefone: data.phone,
      })
     
      form.reset(data)
    } catch (error: any) {
      toast.error('Falha ao atualizar dados', {
        description: error?.message || 'Erro desconhecido',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <TabsContent value="personal" className="space-y-4 pt-4">
      <Form {...form}>
        <div className={cn('flex flex-col gap-6')}>
          <FieldGroup className="grid gap-4 md:grid-cols-2">
            <InputFormField
              control={form.control}
              name="name"
              placeholder="Nome Completo"
              label="Nome Completo"
              type="text"
              disabled={!isEditing}
            />
            <InputFormField
              control={form.control}
              name="email"
              placeholder="email@example.com"
              label="Email"
              type="email"
              disabled={!isEditing}
            />
            <InputFormField
              control={form.control}
              name="phone"
              placeholder="+244999999999"
              label="Número de Telefone"
              type="tel"
              disabled={!isEditing}
            />
            <InputFormField
              control={form.control}
              name="documento"
              placeholder="000000"
              label="Documento"
              type="text"
              disabled
            />
          </FieldGroup>

          <Button
            disabled={!isEditing || loading}
            className="w-full"
            onClick={handleSaveClick} 
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </Form>
    </TabsContent>
  )
}
