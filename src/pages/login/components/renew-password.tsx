import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'
import { Key, Lock, ArrowLeft } from 'lucide-react'
import { LogoBackground } from './logo-background'
import { Form } from '@/components/ui/form'
import { InputFormField } from '@/components/input-form-field'
import { Spinner } from '@/components/ui/spinner'
import { useResetPasswordForm } from './useResetPasswordForm'

export default function RenovarSenha() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const { form, onSubmit } = useResetPasswordForm(token)

  return (
    <div className="flex min-h-screen items-center justify-center relative bg-gradient-to-br from-background to-muted p-4">
      <LogoBackground top="2.5rem" right="2.5rem" />
      <LogoBackground bottom="2.5rem" left="2.5rem" />

      <Card className="w-full max-w-md relative z-10">
        <div className="absolute right-4 top-4 z-10">
          <ModeToggle />
        </div>

        <CardHeader className="space-y-6 text-center">
          <div className="flex justify-center">
            <img
              src="/logo_uma.webp"
              alt="Universidade Metodista de Angola"
              className="h-24 w-auto"
            />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Key className="h-6 w-6 text-primary" />
              Renovar Senha
            </CardTitle>
            <CardDescription>
              Crie uma nova senha segura para acessar sua conta
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <InputFormField
                control={form.control}
                name="novaSenha"
                label="Nova Senha"
                type="password"
                placeholder="Digite uma senha segura"
              />

              <InputFormField
                control={form.control}
                name="repetirSenha"
                label="Repetir Nova Senha"
                type="password"
                placeholder="Digite novamente"
              />

              {/* Regras visíveis */}
              <ul className="text-xs text-muted-foreground list-disc pl-4">
                <li>Mínimo de 8 caracteres</li>
                <li>Uma letra maiúscula</li>
                <li>Um número</li>
                <li>Um caractere especial</li>
              </ul>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Spinner />
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Confirmar Nova Senha
                  </>
                )}
              </Button>

              <div className="text-center pt-4">
                <Button
                  variant="link"
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-sm"
                >
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Voltar para o login
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
