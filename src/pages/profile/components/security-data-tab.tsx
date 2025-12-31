import { Button } from '@/components/ui/button'
import { FieldGroup, FieldSet } from '@/components/ui/field'
import { TabsContent } from '@/components/ui/tabs'
import { Lock } from 'lucide-react'
import { Form } from '@/components/ui/form'
import { InputFormField } from '@/components/input-form-field'
import { Spinner } from '@/components/ui/spinner'
import { useSecurityForm } from './useSecurityForm'

interface SecurityDataTabProps {
  userId: string
  isEditing: boolean
}

export function SecurityDataTab({ isEditing, userId }: SecurityDataTabProps) {
  const { form, onSubmit } = useSecurityForm(userId)

  return (
    <TabsContent value="security" className="space-y-4 pt-4">
      <FieldSet>
        {/* Ícone */}
        <div className="flex justify-center">
          <Lock className="w-20 h-20 text-primary animate-pulse" />
        </div>

        <p className="text-center text-muted-foreground">
          Área de Segurança — Atualize sua senha abaixo
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-6"
          >
            <FieldGroup className="grid gap-4 md:grid-cols-2">
              <InputFormField
                control={form.control}
                name="newPassword"
                label="Nova Senha"
                type="password"
                placeholder="Digite a nova senha"
                disabled={!isEditing}
              />

              <InputFormField
                control={form.control}
                name="confirmPassword"
                label="Confirmar Senha"
                type="password"
                placeholder="Repita a nova senha"
                disabled={!isEditing}
              />
            </FieldGroup>

            <Button
              type="submit"
              disabled={!isEditing || form.formState.isSubmitting}
              className="w-full"
            >
              {form.formState.isSubmitting && <Spinner />}
              Salvar Alterações
            </Button>
          </form>
        </Form>
      </FieldSet>
    </TabsContent>
  )
}
