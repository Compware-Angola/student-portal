import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { TabsContent } from '@/components/ui/tabs'
import { Lock } from "lucide-react"
import { toast } from "sonner";
import { useUpdateStudentPassword } from '@/hooks/student/use-query-mutation-update-password'
interface SecurityDataTabProps {

  updatedAt?: string | null
userId:string
  isEditing: boolean
}



export function SecurityDataTab({
  isEditing,
  userId
}: SecurityDataTabProps) {
  
 
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
   const { mutate } = useUpdateStudentPassword(userId)
  
const handleUpdatePassword = () => {
  if (newPassword.trim().length < 4) {
    toast.error('Falha ao enviar', {
      description: 'A Senha Tem que ter mais de 4 caracteres',
    })
    return
  }

  if (newPassword !== confirmPassword) {
    toast.error('Falha ao enviar', {
      description: 'As senhas não coincidem.',
    })
    return
  }

  setLoading(true) 

  mutate(
    { newPassword, confirmPassword },
    {
      onSuccess: () => {
        setNewPassword('')
        setConfirmPassword('')
        setLoading(false) 
      },
      onError: (error) => {
        console.error(error)
        toast.error('Falha ao enviar', {
          description: (error as Error).message || 'Erro ao atualizar a senha',
        })
        setLoading(false) // desativa loading após erro
      },
    }
  )
}


  return (
    <TabsContent value="security" className="space-y-4 pt-4">
      <FieldSet>
   {/* Cadeado centralizado */}
     <div className="flex justify-center w-full">
        <Lock className="w-20 h-20 text-primary animate-pulse" />
      </div>

      {/* Texto explicativo */}
      <p className="text-center text-muted-foreground mb-4">
        Área de Segurança — Atualize sua senha abaixo
      </p>


        {/* NOVOS CAMPOS DE SENHA */}
        <FieldGroup className="grid gap-4 md:grid-cols-2 mt-6">
          
          <Field>
            <FieldLabel htmlFor="new-password">Nova Senha</FieldLabel>
            <Input
              id="new-password"
              type="password"
              disabled={!isEditing}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite a nova senha"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="confirm-password">Confirmar Senha</FieldLabel>
            <Input
              id="confirm-password"
              type="password"
              disabled={!isEditing}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita a nova senha"
            />
          </Field>

        </FieldGroup>

        {/* BOTÃO SALVAR */}
        <Button
          disabled={!isEditing || loading}
          className="w-full mt-4"
          onClick={handleUpdatePassword}
        >
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>

      </FieldSet>
    </TabsContent>
  )
}
